interface WithdrawalConfig {
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
  processingFee: number; // Porcentagem
  requiredPlayerCount: number;
  isActive: boolean;
}

interface WithdrawalRequest {
  id: string;
  playerAddress: string;
  amount: number;
  requestedAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionHash?: string;
  failureReason?: string;
}

interface WithdrawalStats {
  totalRequests: number;
  totalWithdrawn: number;
  pendingAmount: number;
  dailyWithdrawn: number;
  lastWithdrawal?: string;
}

// Configuração do sistema de saque
export const WITHDRAWAL_CONFIG: WithdrawalConfig = {
  minAmount: 100, // Mínimo 100 SKS
  maxAmount: 10000, // Máximo 10,000 SKS por saque
  dailyLimit: 50000, // Limite diário total de 50,000 SKS
  processingFee: 2.5, // Taxa de 2.5%
  requiredPlayerCount: 2000, // Ativar apenas com 2000+ jogadores ativos
  isActive: true // Sistema ativo, mas depende da contagem de usuários
};

// Verificar se o sistema de saque está ativo
export const isWithdrawalSystemActive = (playerCount: number): boolean => {
  return playerCount >= WITHDRAWAL_CONFIG.requiredPlayerCount && WITHDRAWAL_CONFIG.isActive;
};

// Calcular taxa de processamento
export const calculateProcessingFee = (amount: number): number => {
  return Math.floor(amount * (WITHDRAWAL_CONFIG.processingFee / 100));
};

// Calcular valor líquido após taxa
export const calculateNetAmount = (amount: number): number => {
  const fee = calculateProcessingFee(amount);
  return amount - fee;
};

// Validar solicitação de saque
export const validateWithdrawalRequest = (
  amount: number,
  playerBalance: number,
  dailyWithdrawn: number
): { isValid: boolean; error?: string } => {
  if (amount < WITHDRAWAL_CONFIG.minAmount) {
    return {
      isValid: false,
      error: `Valor mínimo para saque é ${WITHDRAWAL_CONFIG.minAmount} SKS`
    };
  }

  if (amount > WITHDRAWAL_CONFIG.maxAmount) {
    return {
      isValid: false,
      error: `Valor máximo para saque é ${WITHDRAWAL_CONFIG.maxAmount} SKS`
    };
  }

  if (amount > playerBalance) {
    return {
      isValid: false,
      error: 'Saldo insuficiente'
    };
  }

  if (dailyWithdrawn + amount > WITHDRAWAL_CONFIG.dailyLimit) {
    return {
      isValid: false,
      error: 'Limite diário de saques atingido'
    };
  }

  return { isValid: true };
};

// Gerar ID único para solicitação
export const generateWithdrawalId = (): string => {
  return `withdrawal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Criar nova solicitação de saque
export const createWithdrawalRequest = (
  playerAddress: string,
  amount: number
): WithdrawalRequest => {
  return {
    id: generateWithdrawalId(),
    playerAddress,
    amount,
    requestedAt: new Date().toISOString(),
    status: 'pending'
  };
};

// Obter estatísticas de saque do jogador
export const getPlayerWithdrawalStats = (playerAddress: string): WithdrawalStats => {
  const storageKey = `withdrawal_stats_${playerAddress}`;
  const saved = localStorage.getItem(storageKey);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de saque:', error);
    }
  }

  return {
    totalRequests: 0,
    totalWithdrawn: 0,
    pendingAmount: 0,
    dailyWithdrawn: 0
  };
};

// Atualizar estatísticas de saque
export const updateWithdrawalStats = (
  playerAddress: string,
  stats: Partial<WithdrawalStats>
): void => {
  const storageKey = `withdrawal_stats_${playerAddress}`;
  const currentStats = getPlayerWithdrawalStats(playerAddress);
  const updatedStats = { ...currentStats, ...stats };
  
  localStorage.setItem(storageKey, JSON.stringify(updatedStats));
};

// Resetar contador diário (deve ser chamado diariamente)
export const resetDailyWithdrawalLimit = (playerAddress: string): void => {
  const today = new Date().toDateString();
  const stats = getPlayerWithdrawalStats(playerAddress);
  
  if (stats.lastWithdrawal !== today) {
    updateWithdrawalStats(playerAddress, {
      dailyWithdrawn: 0,
      lastWithdrawal: today
    });
  }
};

// Simular processamento de saque (em produção seria integrado com smart contract)
export const processWithdrawal = async (
  request: WithdrawalRequest
): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular sucesso/falha (90% de sucesso)
  const success = Math.random() > 0.1;
  
  if (success) {
    // Simular hash de transação
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    return {
      success: true,
      transactionHash: txHash
    };
  } else {
    return {
      success: false,
      error: 'Falha na transação. Tente novamente mais tarde.'
    };
  }
};