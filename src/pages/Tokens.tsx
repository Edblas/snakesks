import React from 'react';
import { NavigationHeader } from '@/components/ui/navigation';
import { Coins } from 'lucide-react';
import TokenDashboard from '@/components/TokenDashboard';

const Tokens: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <NavigationHeader 
        title="Meus Tokens"
        titleIcon={<Coins className="w-6 h-6 mr-2" />}
        titleColor="text-green-400"
      />

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto p-6">
        <TokenDashboard />
      </main>
    </div>
  );
};

export default Tokens;