import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tv, Clock, Coins, TrendingUp } from 'lucide-react';
import { useAdSystem } from '@/hooks/useAdSystem';

const AdStats: React.FC = () => {
  const { getAdStats, getTimeUntilNextAd, canWatchAd, dailyAdLimit } = useAdSystem();
  const stats = getAdStats();
  const timeUntilNext = getTimeUntilNextAd();

  if (!stats) return null;

  const formatTime = (time: { hours: number; minutes: number; seconds: number } | null) => {
    if (!time) return null;
    
    if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m`;
    } else if (time.minutes > 0) {
      return `${time.minutes}m ${time.seconds}s`;
    } else {
      return `${time.seconds}s`;
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Tv className="text-purple-500" size={20} />
          Estatísticas de Anúncios
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats.dailyAdsWatched}
            </div>
            <div className="text-sm text-gray-400">
              Hoje ({dailyAdLimit} máx)
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.totalAdsWatched}
            </div>
            <div className="text-sm text-gray-400">
              Total
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="text-yellow-500" size={16} />
              <span className="text-white text-sm">Tokens de Anúncios</span>
            </div>
            <div className="text-yellow-400 font-bold">
              {stats.tokensEarnedFromAds} SKS
            </div>
          </div>
        </div>

        {!canWatchAd && timeUntilNext && (
          <div className="bg-orange-900/30 border border-orange-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-orange-400">
              <Clock size={16} />
              <span className="text-sm">
                Próximo anúncio em: <strong>{formatTime(timeUntilNext)}</strong>
              </span>
            </div>
          </div>
        )}

        {stats.dailyAdsWatched >= dailyAdLimit && (
          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400">
              <TrendingUp size={16} />
              <span className="text-sm">
                Limite diário atingido! Volte amanhã para mais anúncios.
              </span>
            </div>
          </div>
        )}

        {canWatchAd && (
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <Tv size={16} />
              <span className="text-sm">
                Você pode assistir um anúncio agora!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdStats;