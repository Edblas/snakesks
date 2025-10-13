import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AdData {
  lastAdWatched: string;
  dailyAdsWatched: number;
  totalAdsWatched: number;
}

const AD_STORAGE_KEY = 'sks_ad_data';
const DAILY_AD_LIMIT = 5; // Limite de anúncios por dia
const AD_REWARD_TOKENS = 10; // Tokens por anúncio assistido
const AD_COOLDOWN_MINUTES = 30; // Cooldown entre anúncios (30 minutos)

export const useAdSystem = () => {
  const [adData, setAdData] = useState<AdData | null>(null);
  const [canWatchAd, setCanWatchAd] = useState(false);
  const [nextAdAvailable, setNextAdAvailable] = useState<Date | null>(null);
  const { toast } = useToast();

  // Carregar dados dos anúncios
  useEffect(() => {
    const loadAdData = () => {
      try {
        const stored = localStorage.getItem(AD_STORAGE_KEY);
        if (stored) {
          const data: AdData = JSON.parse(stored);
          setAdData(data);
          
          // Resetar contador diário se for um novo dia
          const today = new Date().toDateString();
          const lastAdDate = new Date(data.lastAdWatched).toDateString();
          
          if (lastAdDate !== today) {
            const updatedData = {
              ...data,
              dailyAdsWatched: 0
            };
            setAdData(updatedData);
            localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(updatedData));
          }
        } else {
          // Inicializar dados se não existirem
          const initialData: AdData = {
            lastAdWatched: new Date(0).toISOString(),
            dailyAdsWatched: 0,
            totalAdsWatched: 0
          };
          setAdData(initialData);
          localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de anúncios:', error);
      }
    };

    loadAdData();
  }, []);

  // Verificar se pode assistir anúncio
  useEffect(() => {
    if (!adData) return;

    const now = new Date();
    const lastAdTime = new Date(adData.lastAdWatched);
    const timeDiff = now.getTime() - lastAdTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    const hasReachedDailyLimit = adData.dailyAdsWatched >= DAILY_AD_LIMIT;
    const isInCooldown = minutesDiff < AD_COOLDOWN_MINUTES;

    setCanWatchAd(!hasReachedDailyLimit && !isInCooldown);

    // Calcular próximo anúncio disponível
    if (isInCooldown && !hasReachedDailyLimit) {
      const nextAvailable = new Date(lastAdTime.getTime() + (AD_COOLDOWN_MINUTES * 60 * 1000));
      setNextAdAvailable(nextAvailable);
    } else if (hasReachedDailyLimit) {
      // Próximo anúncio disponível amanhã
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      setNextAdAvailable(tomorrow);
    } else {
      setNextAdAvailable(null);
    }
  }, [adData]);

  // Registrar anúncio assistido
  const watchAd = useCallback(() => {
    if (!adData || !canWatchAd) return 0;

    const now = new Date();
    const updatedData: AdData = {
      lastAdWatched: now.toISOString(),
      dailyAdsWatched: adData.dailyAdsWatched + 1,
      totalAdsWatched: adData.totalAdsWatched + 1
    };

    setAdData(updatedData);
    localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(updatedData));

    toast({
      title: "Anúncio assistido!",
      description: `Você ganhou ${AD_REWARD_TOKENS} tokens SKS!`,
    });

    return AD_REWARD_TOKENS;
  }, [adData, canWatchAd, toast]);

  // Obter tempo restante para próximo anúncio
  const getTimeUntilNextAd = useCallback(() => {
    if (!nextAdAvailable) return null;

    const now = new Date();
    const diff = nextAdAvailable.getTime() - now.getTime();
    
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }, [nextAdAvailable]);

  // Obter estatísticas dos anúncios
  const getAdStats = useCallback(() => {
    if (!adData) return null;

    return {
      dailyAdsWatched: adData.dailyAdsWatched,
      dailyLimit: DAILY_AD_LIMIT,
      totalAdsWatched: adData.totalAdsWatched,
      tokensEarnedFromAds: adData.totalAdsWatched * AD_REWARD_TOKENS
    };
  }, [adData]);

  return {
    canWatchAd,
    watchAd,
    getTimeUntilNextAd,
    getAdStats,
    adRewardTokens: AD_REWARD_TOKENS,
    dailyAdLimit: DAILY_AD_LIMIT,
    adCooldownMinutes: AD_COOLDOWN_MINUTES
  };
};

export default useAdSystem;