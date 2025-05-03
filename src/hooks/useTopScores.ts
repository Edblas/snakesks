
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ScoreEntry = {
  id: string;
  score: number;
  created_at: string;
  user_id: string;
};

export const useTopScores = () => {
  const { toast } = useToast();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 20; // Show more scores on the dedicated page

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

  return {
    scores,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage
  };
};
