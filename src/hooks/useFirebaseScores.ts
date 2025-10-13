import { useState, useEffect } from 'react';
import { gameService, GameScore } from '../services/gameService';
import { useToast } from '@/components/ui/use-toast';

export const useFirebaseScores = () => {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const { toast } = useToast();

  const fetchScores = async () => {
    try {
      setIsLoading(true);
      
      // Por enquanto, buscar todos os scores (Firebase tem limitações de paginação mais simples)
      const allScores = await gameService.getTopScores(100); // Buscar mais scores
      
      // Implementar paginação manual
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedScores = allScores.slice(startIndex, endIndex);
      
      setScores(paginatedScores);
      setTotalPages(Math.ceil(allScores.length / itemsPerPage));
      
    } catch (error) {
      console.error('Erro ao buscar scores:', error);
      toast({
        title: "Erro ao carregar ranking",
        description: "Não foi possível carregar os dados do ranking.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [currentPage]);

  return {
    scores,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    refreshScores: fetchScores
  };
};