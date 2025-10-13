
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useFirebaseScores } from '@/hooks/useFirebaseScores';
import { useWeb3 } from '@/components/Web3Provider';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Leaderboard = () => {
  const { toast } = useToast();
  const { isConnected, address } = useWeb3();
  const { 
    scores, 
    isLoading, 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    itemsPerPage,
    refreshScores 
  } = useFirebaseScores();

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
                  className={address === score.userId ? "bg-gray-800 bg-opacity-50" : ""}
                >
                  <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="font-bold text-game-token">{score.score}</TableCell>
                  <TableCell>{score.playerName || formatUserId(score.userId)}</TableCell>
                  <TableCell>{formatDate(score.createdAt)}</TableCell>
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
