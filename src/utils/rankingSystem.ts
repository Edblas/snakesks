export interface RankInfo {
  name: string;
  minGames: number;
  minTokens: number;
  color: string;
  icon: string;
  bonusMultiplier: number; // Multiplicador de bônus para tokens
  description: string;
}

export const RANKS: RankInfo[] = [
  {
    name: 'Iniciante',
    minGames: 0,
    minTokens: 0,
    color: '#9CA3AF', // gray-400
    icon: '🐍',
    bonusMultiplier: 1.0,
    description: 'Bem-vindo ao Snake SKS!'
  },
  {
    name: 'Explorador',
    minGames: 10,
    minTokens: 100,
    color: '#10B981', // green-500
    icon: '🌱',
    bonusMultiplier: 1.1,
    description: 'Você está começando a dominar o jogo!'
  },
  {
    name: 'Aventureiro',
    minGames: 25,
    minTokens: 300,
    color: '#3B82F6', // blue-500
    icon: '⚡',
    bonusMultiplier: 1.2,
    description: 'Suas habilidades estão melhorando!'
  },
  {
    name: 'Veterano',
    minGames: 50,
    minTokens: 750,
    color: '#8B5CF6', // violet-500
    icon: '🏆',
    bonusMultiplier: 1.3,
    description: 'Um jogador experiente e dedicado!'
  },
  {
    name: 'Especialista',
    minGames: 100,
    minTokens: 1500,
    color: '#F59E0B', // amber-500
    icon: '💎',
    bonusMultiplier: 1.4,
    description: 'Você domina as técnicas avançadas!'
  },
  {
    name: 'Mestre',
    minGames: 200,
    minTokens: 3000,
    color: '#EF4444', // red-500
    icon: '👑',
    bonusMultiplier: 1.5,
    description: 'Um verdadeiro mestre do Snake!'
  },
  {
    name: 'Lenda',
    minGames: 500,
    minTokens: 7500,
    color: '#F97316', // orange-500
    icon: '🔥',
    bonusMultiplier: 1.75,
    description: 'Poucos chegam a este nível!'
  },
  {
    name: 'Imortal',
    minGames: 1000,
    minTokens: 15000,
    color: '#EC4899', // pink-500
    icon: '⭐',
    bonusMultiplier: 2.0,
    description: 'O rank mais alto possível!'
  }
];

export const calculateRank = (gamesPlayed: number, tokensEarned: number): RankInfo => {
  // Encontrar o rank mais alto que o jogador qualifica
  let currentRank = RANKS[0]; // Iniciante por padrão
  
  for (const rank of RANKS) {
    if (gamesPlayed >= rank.minGames && tokensEarned >= rank.minTokens) {
      currentRank = rank;
    } else {
      break; // Para no primeiro rank que não qualifica
    }
  }
  
  return currentRank;
};

export const getNextRank = (currentRank: RankInfo): RankInfo | null => {
  const currentIndex = RANKS.findIndex(rank => rank.name === currentRank.name);
  
  if (currentIndex === -1 || currentIndex === RANKS.length - 1) {
    return null; // Já é o rank mais alto
  }
  
  return RANKS[currentIndex + 1];
};

export const getRankProgress = (gamesPlayed: number, tokensEarned: number, currentRank: RankInfo): {
  gamesProgress: number;
  tokensProgress: number;
  overallProgress: number;
} => {
  const nextRank = getNextRank(currentRank);
  
  if (!nextRank) {
    return {
      gamesProgress: 100,
      tokensProgress: 100,
      overallProgress: 100
    };
  }
  
  // Calcular progresso baseado nos requisitos do próximo rank
  const gamesNeeded = nextRank.minGames - currentRank.minGames;
  const gamesProgress = gamesNeeded > 0 
    ? Math.min(100, ((gamesPlayed - currentRank.minGames) / gamesNeeded) * 100)
    : 100;
  
  const tokensNeeded = nextRank.minTokens - currentRank.minTokens;
  const tokensProgress = tokensNeeded > 0
    ? Math.min(100, ((tokensEarned - currentRank.minTokens) / tokensNeeded) * 100)
    : 100;
  
  // Progresso geral é a média dos dois
  const overallProgress = (gamesProgress + tokensProgress) / 2;
  
  return {
    gamesProgress: Math.max(0, gamesProgress),
    tokensProgress: Math.max(0, tokensProgress),
    overallProgress: Math.max(0, overallProgress)
  };
};

export const calculateBonusTokens = (baseTokens: number, rank: RankInfo): number => {
  const bonus = Math.floor(baseTokens * (rank.bonusMultiplier - 1));
  return bonus;
};

export const getRankByName = (rankName: string): RankInfo | undefined => {
  return RANKS.find(rank => rank.name === rankName);
};

export const getAllRanks = (): RankInfo[] => {
  return [...RANKS];
};