
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type MonthlyReward = {
  id: string;
  month: string;
  year: string;
  user_id: string;
  reward_amount: number;
  claimed: boolean;
  created_at: string;
};

export const useRewards = (address: string | null, isConnected: boolean) => {
  const { toast } = useToast();
  const [rewards, setRewards] = useState<MonthlyReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  return {
    rewards,
    isLoading,
    currentMonth,
    currentYear,
    getMonthName,
    claimReward
  };
};
