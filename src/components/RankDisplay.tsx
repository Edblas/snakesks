import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Coins, TrendingUp } from 'lucide-react';
import { RankInfo, getNextRank, getRankProgress } from '@/utils/rankingSystem';

interface RankDisplayProps {
  currentRank: RankInfo;
  gamesPlayed: number;
  tokensEarned: number;
  className?: string;
}

const RankDisplay: React.FC<RankDisplayProps> = ({
  currentRank,
  gamesPlayed,
  tokensEarned,
  className = ''
}) => {
  const nextRank = getNextRank(currentRank);
  const progress = getRankProgress(gamesPlayed, tokensEarned, currentRank);

  return (
    <Card className={`bg-gray-900 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          Seu Rank
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Rank Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="text-3xl p-2 rounded-lg"
              style={{ backgroundColor: `${currentRank.color}20` }}
            >
              {currentRank.icon}
            </div>
            <div>
              <Badge 
                className="text-white font-bold"
                style={{ backgroundColor: currentRank.color }}
              >
                {currentRank.name}
              </Badge>
              <p className="text-sm text-gray-400 mt-1">
                {currentRank.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Bônus</div>
            <div className="text-green-400 font-bold">
              +{Math.round((currentRank.bonusMultiplier - 1) * 100)}%
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-blue-400">
              {gamesPlayed}
            </div>
            <div className="text-sm text-gray-400">
              Jogos
            </div>
          </div>
          
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-yellow-400">
              {tokensEarned}
            </div>
            <div className="text-sm text-gray-400">
              Tokens SKS
            </div>
          </div>
        </div>

        {/* Next Rank Progress */}
        {nextRank ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Próximo: {nextRank.name} {nextRank.icon}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(progress.overallProgress)}%
              </span>
            </div>
            
            <Progress 
              value={progress.overallProgress} 
              className="h-2"
            />
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Target size={12} className="text-blue-400" />
                <span className="text-gray-400">
                  Jogos: {gamesPlayed}/{nextRank.minGames}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Coins size={12} className="text-yellow-400" />
                <span className="text-gray-400">
                  Tokens: {tokensEarned}/{nextRank.minTokens}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-400">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">
                🎉 Você atingiu o rank máximo!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankDisplay;