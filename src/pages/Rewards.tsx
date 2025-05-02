
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWeb3 } from '@/components/Web3Provider';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

type MonthlyReward = {
  id: string;
  month: string;
  year: string;
  user_id: string;
  reward_amount: number;
  claimed: boolean;
  created_at: string;
};

const MonthlyRewards = () => {
  const { toast } = useToast();
  const [rewards, setRewards] = useState<MonthlyReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { address, isConnected } = useWeb3();
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<string>('');
  
  useEffect(() => {
    // Set current month and year
    const date = new Date();
    setCurrentMonth((date.getMonth() + 1).toString());
    setCurrentYear(date.getFullYear().toString());
    
    if (isConnected && address) {
      fetchRewards();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('monthly_rewards')
        .select('*')
        .eq('user_id', address);
      
      if (error) {
        throw error;
      }
      
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast({
        title: "Error loading rewards",
        description: "Could not load your reward data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthName = (monthNum: string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[parseInt(monthNum) - 1];
  };

  const claimReward = async (rewardId: string) => {
    try {
      // In a real implementation, this would integrate with the blockchain
      // to transfer tokens to the user's wallet
      const { data, error } = await supabase
        .from('monthly_rewards')
        .update({ claimed: true })
        .eq('id', rewardId)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Update the local state
        setRewards(rewards.map(reward => 
          reward.id === rewardId ? { ...reward, claimed: true } : reward
        ));
        
        toast({
          title: "Reward Claimed!",
          description: `${data[0].reward_amount} SKS tokens have been sent to your wallet.`,
        });
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Error claiming reward",
        description: "Could not process your reward claim. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Monthly SKS Rewards</h1>
      
      {!isConnected ? (
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
          <p className="text-center mb-4">Connect your wallet to view and claim your rewards!</p>
          <div className="flex justify-center">
            <Button onClick={() => {}} className="bg-game-token hover:bg-purple-600">
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
          
          {rewards.length === 0 ? (
            <div className="text-center py-6">
              <p className="mb-2">No rewards yet!</p>
              <p className="text-sm text-gray-400">
                Play Snake and rank high on the monthly leaderboard to earn SKS tokens.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell>
                      {getMonthName(reward.month)} {reward.year}
                    </TableCell>
                    <TableCell className="font-bold text-game-token">
                      {reward.reward_amount} SKS
                    </TableCell>
                    <TableCell>
                      {reward.claimed ? 
                        <span className="text-green-400">Claimed</span> : 
                        <span className="text-yellow-400">Unclaimed</span>
                      }
                    </TableCell>
                    <TableCell>
                      {!reward.claimed && (
                        <Button 
                          onClick={() => claimReward(reward.id)}
                          className="bg-game-token hover:bg-purple-600 text-xs py-1 px-2 h-auto"
                        >
                          Claim
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h3 className="text-lg mb-3">Current Ranking Period</h3>
            <p className="text-gray-300 mb-1">Month: <span className="text-game-token">{getMonthName(currentMonth)}</span></p>
            <p className="text-gray-300 mb-3">Year: <span className="text-game-token">{currentYear}</span></p>
            <p className="text-sm text-gray-400">
              Play more games and score higher to improve your ranking for this month's rewards!
            </p>
          </div>
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

export default MonthlyRewards;
