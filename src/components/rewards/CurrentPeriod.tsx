
import React from 'react';
import { Calendar } from 'lucide-react';

interface CurrentPeriodProps {
  currentMonth: string;
  currentYear: string;
  getMonthName: (monthNum: string) => string;
}

const CurrentPeriod = ({ currentMonth, currentYear, getMonthName }: CurrentPeriodProps) => {
  return (
    <div className="mt-6 pt-4 border-t border-gray-700">
      <h3 className="text-lg mb-3 flex items-center gap-2">
        <Calendar size={18} className="text-game-token" />
        Current Ranking Period
      </h3>
      <p className="text-gray-300 mb-1">
        Month: <span className="text-game-token">{getMonthName(currentMonth)}</span>
      </p>
      <p className="text-gray-300 mb-3">
        Year: <span className="text-game-token">{currentYear}</span>
      </p>
      <p className="text-sm text-gray-400">
        Play more games and score higher to improve your ranking for this month's rewards!
      </p>
    </div>
  );
};

export default CurrentPeriod;
