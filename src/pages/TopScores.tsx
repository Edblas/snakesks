
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/Web3Provider';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useTopScores } from '@/hooks/useTopScores';
import ScoresTable from '@/components/scores/ScoresTable';
import ScoresPagination from '@/components/scores/ScoresPagination';

const TopScores = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useWeb3();
  const { scores, isLoading, currentPage, totalPages, setCurrentPage, itemsPerPage } = useTopScores();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <header className="w-full max-w-3xl flex justify-between items-center mb-8 px-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-white">
          &larr; Back to Game
        </Button>
        
        <h1 className="text-2xl font-bold text-game-token flex items-center">
          <Trophy className="mr-2" /> Top Scores
        </h1>
      </header>
      
      <main className="w-full max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 mb-8">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">All-Time Best Scores</h2>
          <p className="text-sm text-gray-400">
            {isConnected ? "Your scores are highlighted" : "Connect wallet to track your scores"}
          </p>
        </div>
        
        <ScoresTable 
          scores={scores} 
          isLoading={isLoading} 
          currentPage={currentPage} 
          itemsPerPage={itemsPerPage}
          currentUserAddress={address}
        />

        <ScoresPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          setCurrentPage={setCurrentPage} 
        />

        {!isConnected && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            Connect your wallet to appear on the leaderboard!
          </p>
        )}
      </main>

      <footer className="mt-auto text-center text-sm text-gray-500 pb-8">
        <p>Play Snake, watch ads, earn SKS tokens!</p>
        <p className="mt-2 text-xs">Built on Polygon Network</p>
      </footer>
    </div>
  );
};

export default TopScores;
