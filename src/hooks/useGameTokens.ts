import { useState, useEffect } from 'react';
import { gameService, UserProfile } from '../services/gameService';
import { adService } from '../services/adService';
import { useToast } from '@/components/ui/use-toast';

export const useGameTokens = (userId: string) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const { toast } = useToast();

  // Carregar perfil do usuário
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await gameService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar score e ganhar tokens
  const saveScore = async (playerName: string, score: number): Promise<number> => {
    try {
      const tokensEarned = await gameService.saveScore(userId, playerName, score);
      
      // Atualizar perfil local
      await loadUserProfile();
      
      toast({
        title: "Score Salvo!",
        description: `Você ganhou ${tokensEarned} tokens!`,
      });
      
      return tokensEarned;
    } catch (error) {
      console.error('Erro ao salvar score:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu score.",
        variant: "destructive",
      });
      return 0;
    }
  };

  // Assistir anúncio de vídeo para ganhar tokens
  const watchRewardedVideo = async (): Promise<number> => {
    try {
      setIsWatchingAd(true);
      const tokensEarned = await adService.showRewardedVideo(userId);
      
      if (tokensEarned > 0) {
        // Atualizar perfil local
        await loadUserProfile();
        
        toast({
          title: "Recompensa Recebida!",
          description: `Você ganhou ${tokensEarned} tokens assistindo ao anúncio!`,
        });
      } else {
        // Nenhuma recompensa: possivelmente anúncio falhou ou foi cancelado
        toast({
          title: "Anúncio indisponível",
          description: "Não foi possível exibir ou concluir o anúncio agora. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
      
      return tokensEarned;
    } catch (error) {
      console.error('Erro ao assistir anúncio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o anúncio.",
        variant: "destructive",
      });
      return 0;
    } finally {
      setIsWatchingAd(false);
    }
  };

  // Mostrar anúncio intersticial
  const showInterstitialAd = async (): Promise<number> => {
    try {
      const tokensEarned = await adService.showInterstitial(userId);
      
      if (tokensEarned > 0) {
        await loadUserProfile();
        
        toast({
          title: "Bonus!",
          description: `Você ganhou ${tokensEarned} tokens!`,
        });
      }
      
      return tokensEarned;
    } catch (error) {
      console.error('Erro ao mostrar intersticial:', error);
      return 0;
    }
  };

  // Inicializar
  useEffect(() => {
    if (userId) {
      loadUserProfile();
      adService.initialize();
    }
  }, [userId]);

  return {
    userProfile,
    isLoading,
    isWatchingAd,
    saveScore,
    watchRewardedVideo,
    showInterstitialAd,
    refreshProfile: loadUserProfile,
    totalTokens: userProfile?.totalTokens || 0,
    totalScore: userProfile?.totalScore || 0,
    gamesPlayed: userProfile?.gamesPlayed || 0,
    adsWatched: userProfile?.adsWatched || 0
  };
};