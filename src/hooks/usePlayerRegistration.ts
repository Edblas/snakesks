import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SKS_TOKEN_POLYGON } from '@/utils/polygonConfig';
import { calculateRank, calculateBonusTokens, RankInfo } from '@/utils/rankingSystem';

interface PlayerData {
  address: string;
  registeredAt: string;
  gamesPlayed: number;
  tokensEarned: number;
  lastPlayDate: string;
  dailyGamesCount: number;
  rank: string;
  currentRank?: RankInfo; // Informações completas do rank
}

const STORAGE_KEY = 'sks_player_data';
const DAILY_GAME_LIMIT = SKS_TOKEN_POLYGON.dailyRewardLimit / SKS_TOKEN_POLYGON.rewardPerGame; // Baseado nas configurações do token

export const usePlayerRegistration = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  // Carregar dados do jogador do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        // Calcular rank atual se não existir
        if (!data.currentRank) {
          data.currentRank = calculateRank(data.gamesPlayed || 0, data.tokensEarned || 0);
          data.rank = data.currentRank.name;
        }
        
        setPlayerData(data);
        setIsRegistered(true);
        
        // Resetar contador diário se for um novo dia
        const today = new Date().toDateString();
        if (data.lastPlayDate !== today) {
          const updatedData = {
            ...data,
            dailyGamesCount: 0,
            lastPlayDate: today
          };
          setPlayerData(updatedData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do jogador:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Registrar novo jogador
  const registerPlayer = (address: string) => {
    const initialRank = calculateRank(0, 0);
    
    const newPlayerData: PlayerData = {
      address,
      registeredAt: new Date().toISOString(),
      gamesPlayed: 0,
      tokensEarned: 0,
      lastPlayDate: new Date().toDateString(),
      dailyGamesCount: 0,
      rank: initialRank.name,
      currentRank: initialRank
    };

    setPlayerData(newPlayerData);
    setIsRegistered(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlayerData));

    toast({
      title: "Bem-vindo ao Snake SKS!",
      description: "Sua carteira foi registrada. Comece a jogar para ganhar tokens!",
    });
  };

  // Atualizar dados após uma partida
  const updateAfterGame = (score: number) => {
    if (!playerData) return;

    const today = new Date().toDateString();
    const isNewDay = playerData.lastPlayDate !== today;
    
    // Calcular tokens ganhos baseado na pontuação e limite diário
    let baseTokens = 0;
    const currentDailyCount = isNewDay ? 0 : playerData.dailyGamesCount;
    
    if (currentDailyCount < DAILY_GAME_LIMIT) {
      // Fórmula: 1 token base + bonus por pontuação
      baseTokens = Math.floor(1 + (score / 100));
      baseTokens = Math.min(baseTokens, 10); // Máximo 10 tokens por jogo
    }

    // Calcular rank atual baseado em estatísticas
    const totalGames = playerData.gamesPlayed + 1;
    const totalTokens = playerData.tokensEarned + baseTokens;
    const currentRankInfo = calculateRank(totalGames, totalTokens);
    
    // Aplicar bônus de rank aos tokens
    const bonusTokens = calculateBonusTokens(baseTokens, currentRankInfo);
    const finalTokens = baseTokens + bonusTokens;

    const updatedData: PlayerData = {
      ...playerData,
      gamesPlayed: totalGames,
      tokensEarned: totalTokens + bonusTokens,
      lastPlayDate: today,
      dailyGamesCount: currentDailyCount + 1,
      rank: currentRankInfo.name,
      currentRank: currentRankInfo
    };

    setPlayerData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    // Verificar se houve mudança de rank
    const previousRank = playerData.currentRank?.name || playerData.rank;
    const rankChanged = previousRank !== currentRankInfo.name;

    // Mostrar notificação sobre tokens ganhos
    if (finalTokens > 0) {
      let description = `Pontuação: ${score} | Jogos hoje: ${updatedData.dailyGamesCount}/${DAILY_GAME_LIMIT}`;
      
      if (bonusTokens > 0) {
        description += ` | Bônus ${currentRankInfo.name}: +${bonusTokens}`;
      }
      
      toast({
        title: `+${finalTokens} SKS Tokens!`,
        description,
      });
    }

    // Mostrar notificação de mudança de rank
    if (rankChanged) {
      toast({
        title: `🎉 Rank Up! ${currentRankInfo.icon}`,
        description: `Você alcançou o rank ${currentRankInfo.name}! Bônus: +${Math.round((currentRankInfo.bonusMultiplier - 1) * 100)}%`,
      });
    }

    if (finalTokens === 0 && currentDailyCount >= DAILY_GAME_LIMIT) {
      toast({
        title: "Limite diário atingido",
        description: "Você já ganhou o máximo de tokens hoje. Volte amanhã!",
        variant: "destructive",
      });
    }

    return tokensEarned;
  };

  // Verificar se pode ganhar tokens hoje
  const canEarnTokensToday = (): boolean => {
    if (!playerData) return false;
    
    const today = new Date().toDateString();
    const isNewDay = playerData.lastPlayDate !== today;
    
    return isNewDay || playerData.dailyGamesCount < DAILY_GAME_LIMIT;
  };

  // Obter estatísticas do jogador
  const getPlayerStats = () => {
    if (!playerData) return null;

    const today = new Date().toDateString();
    const isNewDay = playerData.lastPlayDate !== today;
    const dailyGamesLeft = Math.max(0, DAILY_GAME_LIMIT - (isNewDay ? 0 : playerData.dailyGamesCount));

    return {
      ...playerData,
      dailyGamesLeft,
      canEarnTokens: canEarnTokensToday(),
      totalValue: playerData.tokensEarned * 0.001 // Valor estimado em USD (exemplo)
    };
  };

  // Atualizar endereço da carteira
  const updateWalletAddress = (newAddress: string) => {
    if (!playerData) return;

    const updatedData = {
      ...playerData,
      address: newAddress
    };

    setPlayerData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    toast({
      title: "Carteira atualizada",
      description: "Endereço da carteira foi atualizado com sucesso.",
    });
  };

  return {
    playerData,
    isRegistered,
    registerPlayer,
    updateAfterGame,
    canEarnTokensToday,
    getPlayerStats,
    updateWalletAddress,
    dailyLimit: DAILY_GAME_LIMIT
  };
};