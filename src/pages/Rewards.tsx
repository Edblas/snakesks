
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/components/Web3Provider';
import RewardsTable from '@/components/rewards/RewardsTable';
import CurrentPeriod from '@/components/rewards/CurrentPeriod';
import { useRewards } from '@/hooks/useRewards';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Rewards = () => {
  const { 
    address, 
    isConnected, 
    tokenBalance, 
    minWithdrawalAmount,
    connectWallet 
  } = useWeb3();
  const { 
    rewards, 
    isLoading, 
    currentMonth, 
    currentYear, 
    getMonthName,
    claimReward 
  } = useRewards(address, isConnected);

  const [showWithdrawalInfo, setShowWithdrawalInfo] = useState(false);

  const toggleWithdrawalInfo = () => {
    setShowWithdrawalInfo(!showWithdrawalInfo);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Monthly SKS Rewards</h1>
      
      {!isConnected ? (
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
          <p className="text-center mb-4">Connect your wallet to view and claim your rewards!</p>
          <div className="flex justify-center">
            <Button 
              className="bg-game-token hover:bg-purple-600"
              onClick={connectWallet}
            >
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">Your Rewards</h2>
            <div className="text-sm">
              <span className="text-gray-400">Balance:</span> 
              <span className="text-game-token font-semibold ml-1">{tokenBalance} SKS</span>
            </div>
          </div>
          
          {tokenBalance >= minWithdrawalAmount && (
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-700 hover:bg-gray-800"
                onClick={toggleWithdrawalInfo}
              >
                Withdraw Tokens
              </Button>
            </div>
          )}

          {showWithdrawalInfo && (
            <Alert className="mb-4 bg-gray-800 border-gray-700">
              <AlertCircle className="h-4 w-4 text-game-token" />
              <AlertTitle>Withdrawal Information</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Minimum withdrawal amount: <span className="text-game-token font-bold">{minWithdrawalAmount} SKS</span></p>
                <p className="text-sm text-gray-400">
                  To withdraw tokens, please use the official SKS dApp or MetaMask directly.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
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
