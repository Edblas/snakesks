import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Gamepad2, Trophy, Gift } from 'lucide-react';

interface NavigationHeaderProps {
  title: string;
  titleIcon?: React.ReactNode;
  showBackButton?: boolean;
  backPath?: string;
  titleColor?: string;
}

export function NavigationHeader({ 
  title, 
  titleIcon, 
  showBackButton = true, 
  backPath = '/',
  titleColor = 'text-green-400'
}: NavigationHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="safe-area-top bg-gray-800/50 border-b border-gray-700 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button 
              onClick={() => navigate(backPath)} 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          <h1 className={`text-2xl font-bold ${titleColor} flex items-center`}>
            {titleIcon}
            {title}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="border-gray-600 text-white hover:bg-gray-800"
          >
            <Home className="w-4 h-4 mr-2" />
            Início
          </Button>
          <Button 
            onClick={() => navigate('/game')}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Jogar
          </Button>
        </div>
      </div>
    </header>
  );
}

interface QuickNavigationProps {
  currentPage?: string;
}

export function QuickNavigation({ currentPage }: QuickNavigationProps) {
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/about',
      icon: 'ℹ️',
      label: 'Sobre o Jogo',
      key: 'about'
    },
    {
      path: '/rewards',
      icon: '🎁',
      label: 'Recompensas',
      key: 'rewards'
    },
    {
      path: '/top-scores',
      icon: '🏆',
      label: 'Top Scores',
      key: 'top-scores'
    }
  ];

  return (
    <footer className="safe-area-bottom mt-12 pt-8 border-t border-gray-700">
      <div className="grid md:grid-cols-3 gap-6 text-center">
        {navItems.map((item) => (
          <Button 
            key={item.key}
            onClick={() => navigate(item.path)}
            variant={currentPage === item.key ? "default" : "outline"}
            className={`
              h-20 flex flex-col items-center justify-center
              ${currentPage === item.key 
                ? "bg-green-600 hover:bg-green-700 text-black" 
                : "border-gray-600 text-black hover:bg-gray-800"
              }
            `}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </footer>
  );
}