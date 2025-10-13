import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/components/Web3Provider';
import { usePlayerRegistration } from '@/hooks/usePlayerRegistration';
import {
  WITHDRAWAL_CONFIG,
  isWithdrawalSystemActive,
  validateWithdrawalRequest,
  calculateProcessingFee,
  calculateNetAmount,
  createWithdrawalRequest,
  getPlayerWithdrawalStats,
  updateWithdrawalStats,
  resetDailyWithdrawalLimit,
  processWithdrawal,
  WithdrawalRequest,
  WithdrawalStats
} from '@/utils/withdrawalSystem';

interface UseWithdrawalReturn {
  isSystemActive: boolean;
  isProcessing: boolean;
  withdrawalStats: WithdrawalStats;
  config: typeof WITHDRAWAL_CONFIG;
  requestWithdrawal: (amount: number) => Promise<void>;
  calculateFee: (amount: number) => number;
  calculateNet: (amount: number) => number;
  validateAmount: (amount: number) => { isValid: boolean; error?: string };
  refreshStats: () => void;
}

export const useWithdrawal = (): UseWithdrawalReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalStats, setWithdrawalStats] = useState<WithdrawalStats>({
    totalRequests: 0,
    totalWithdrawn: 0,
    pendingAmount: 0,
    dailyWithdrawn: 0
  });

  const { toast } = useToast();
  const { address } = useWeb3();
  const { playerData } = usePlayerRegistration();

  // Verificar se o sistema está ativo usando dados reais
  const isSystemActive = isWithdrawalSystemActive(withdrawalStats.activeUsers);

  // Carregar estatísticas do jogador
  const loadStats = useCallback(() => {
    if (!address) return;
    
    resetDailyWithdrawalLimit(address);
    const stats = getPlayerWithdrawalStats(address);
    setWithdrawalStats(stats);
  }, [address]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Validar valor de saque
  const validateAmount = useCallback((amount: number) => {
    if (!playerData) {
      return { isValid: false, error: 'Dados do jogador não encontrados' };
    }

    return validateWithdrawalRequest(
      amount,
      playerData.tokensEarned,
      withdrawalStats.dailyWithdrawn
    );
  }, [playerData, withdrawalStats.dailyWithdrawn]);

  // Solicitar saque
  const requestWithdrawal = useCallback(async (amount: number) => {
    if (!address || !playerData) {
      toast({
        title: "Erro",
        description: "Conecte sua carteira primeiro",
        variant: "destructive"
      });
      return;
    }

    if (!isSystemActive) {
      toast({
        title: "Sistema Indisponível",
        description: `O sistema de saque será ativado quando atingirmos ${WITHDRAWAL_CONFIG.requiredPlayerCount} jogadores. Atualmente: ${MOCK_PLAYER_COUNT}`,
        variant: "destructive"
      });
      return;
    }

    const validation = validateAmount(amount);
    if (!validation.isValid) {
      toast({
        title: "Valor Inválido",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Criar solicitação
      const request = createWithdrawalRequest(address, amount);
      
      // Mostrar informações da taxa
      const fee = calculateProcessingFee(amount);
      const netAmount = calculateNetAmount(amount);
      
      toast({
        title: "Processando Saque",
        description: `Valor: ${amount} SKS | Taxa: ${fee} SKS | Líquido: ${netAmount} SKS`,
      });

      // Processar saque
      const result = await processWithdrawal(request);
      
      if (result.success) {
        // Atualizar estatísticas
        updateWithdrawalStats(address, {
          totalRequests: withdrawalStats.totalRequests + 1,
          totalWithdrawn: withdrawalStats.totalWithdrawn + netAmount,
          dailyWithdrawn: withdrawalStats.dailyWithdrawn + amount,
          lastWithdrawal: new Date().toDateString()
        });

        // Atualizar saldo do jogador (simular dedução)
        // Em produção, isso seria feito pelo smart contract
        
        toast({
          title: "Saque Processado!",
          description: `${netAmount} SKS enviados para sua carteira. TX: ${result.transactionHash?.slice(0, 10)}...`,
        });

        loadStats(); // Recarregar estatísticas
      } else {
        toast({
          title: "Falha no Saque",
          description: result.error || "Erro desconhecido",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro no saque:', error);
      toast({
        title: "Erro no Sistema",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [address, playerData, isSystemActive, validateAmount, withdrawalStats, toast, loadStats]);

  return {
    isSystemActive,
    isProcessing,
    withdrawalStats,
    config: WITHDRAWAL_CONFIG,
    requestWithdrawal,
    calculateFee: calculateProcessingFee,
    calculateNet: calculateNetAmount,
    validateAmount,
    refreshStats: loadStats
  };
};