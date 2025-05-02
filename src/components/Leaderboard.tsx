
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/components/Web3Provider';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

type ScoreEntry = {
  id: string;
  score: number;
  created_at: string;
  user_id: string;
};

const Leaderboard = () => {
  const { toast } = useToast();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isConnected, address } = useWeb3();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchScores();
  }, [currentPage]);

  const fetchScores = async () => {
    try {
      setIsLoading(true);
      
      // First, get the count of all scores
      const { count, error: countError } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        throw countError;
      }
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
      
      // Then fetch the current page of scores
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
      if (error) {
        throw error;
      }
      
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error loading leaderboard",
        description: "Could not load the leaderboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format user ID to be more readable (truncate and show only part of the address)
  const formatUserId = (userId: string) => {
    return `${userId.substring(0, 6)}...${userId.substring(userId.length - 4)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-center text-white">Top Scores</h2>
      
      <ScrollArea className="h-[300px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-game-token">#</TableHead>
              <TableHead className="text-game-token">Score</TableHead>
              <TableHead className="text-game-token">Player</TableHead>
              <TableHead className="text-game-token">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">Loading scores...</TableCell>
              </TableRow>
            ) : scores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">No scores yet. Be the first!</TableCell>
              </TableRow>
            ) : (
              scores.map((score, index) => (
                <TableRow 
                  key={score.id}
                  className={address === score.user_id ? "bg-gray-800 bg-opacity-50" : ""}
                >
                  <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="font-bold text-game-token">{score.score}</TableCell>
                  <TableCell>{formatUserId(score.user_id)}</TableCell>
                  <TableCell>{formatDate(score.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            // Show current page and adjacent pages
            let pageToShow;
            if (totalPages <= 3) {
              pageToShow = i + 1;
            } else if (currentPage === 1) {
              pageToShow = i + 1;
            } else if (currentPage === totalPages) {
              pageToShow = totalPages - 2 + i;
            } else {
              pageToShow = currentPage - 1 + i;
            }
            
            return (
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(pageToShow)}
                  isActive={currentPage === pageToShow}
                >
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {!isConnected && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          Connect your wallet to appear on the leaderboard!
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
