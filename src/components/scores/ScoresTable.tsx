
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScoreEntry } from '@/hooks/useTopScores';
import { formatDate, formatUserId } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

interface ScoresTableProps {
  scores: ScoreEntry[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  currentUserAddress?: string;
}

const ScoresTable = ({ scores, isLoading, currentPage, itemsPerPage, currentUserAddress }: ScoresTableProps) => {
  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-game-token">Rank</TableHead>
            <TableHead className="text-game-token">Score</TableHead>
            <TableHead className="text-game-token">Player</TableHead>
            <TableHead className="text-game-token">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              </TableRow>
            ))
          ) : scores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">No scores yet. Be the first!</TableCell>
            </TableRow>
          ) : (
            scores.map((score, index) => (
              <TableRow 
                key={score.id}
                className={currentUserAddress === score.user_id ? "bg-gray-800 bg-opacity-50" : ""}
              >
                <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell className="font-bold text-game-token">{score.score}</TableCell>
                <TableCell>{formatUserId(score.user_id || 'Anonymous')}</TableCell>
                <TableCell>{formatDate(score.created_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ScoresTable;
