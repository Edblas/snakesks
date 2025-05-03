
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/Web3Provider';
import RewardsTable from '@/components/rewards/RewardsTable';
import CurrentPeriod from '@/components/rewards/CurrentPeriod';
import { useRewards } from '@/hooks/useRewards';

const Rewards = () => {
  const { address, isConnected } = useWeb3();
  const { 
    rewards, 
    isLoading, 
    currentMonth, 
    currentYear, 
    getMonthName,
    claimReward 
  } = useRewards(address, isConnected);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Monthly SKS Rewards</h1>
      
      {!isConnected ? (
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
          <p className="text-center mb-4">Connect your wallet to view and claim your rewards!</p>
          <div className="flex justify-center">
            <Button className="bg-game-token hover:bg-purple-600">
              Connect Wallet
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
          <p className="text-center">Loading your rewards...</p>
        </div>
      ) : (
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl mb-4">Your Rewards</h2>
          
          <RewardsTable 
            rewards={rewards}
            getMonthName={getMonthName}
            claimReward={claimReward}
          />
          
          <CurrentPeriod 
            currentMonth={currentMonth}
            currentYear={currentYear}
            getMonthName={getMonthName}
          />
        </div>
      )}

      <div className="mt-8">
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline" 
          className="border-gray-700 hover:bg-gray-800"
        >
          Back to Game
        </Button>
      </div>
    </div>
  );
};

export default Rewards;
