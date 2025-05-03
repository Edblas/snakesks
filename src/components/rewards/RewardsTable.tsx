
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

type MonthlyReward = {
  id: string;
  month: string;
  year: string;
  user_id: string;
  reward_amount: number;
  claimed: boolean;
  created_at: string;
};

interface RewardsTableProps {
  rewards: MonthlyReward[];
  getMonthName: (monthNum: string) => string;
  claimReward: (rewardId: string) => Promise<void>;
}

const RewardsTable = ({ rewards, getMonthName, claimReward }: RewardsTableProps) => {
  if (rewards.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="mb-2">No rewards yet!</p>
        <p className="text-sm text-gray-400">
          Play Snake and rank high on the monthly leaderboard to earn SKS tokens.
        </p>
      </div>
    );
  }
  
  return (
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
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-game-token" />
                {reward.reward_amount} SKS
              </div>
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
  );
};

export default RewardsTable;
