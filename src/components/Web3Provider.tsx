
import React from 'react';
import { Web3Context, Web3ContextType } from '@/contexts/Web3Context';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenWithdrawal } from '@/hooks/useTokenWithdrawal';

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  // Use our custom hooks
  const {
    address,
    balance,
    isConnected,
    isConnecting,
    connectWallet
  } = useWalletConnection();

  const {
    tokenBalance,
    tokenContract,
    provider,
    refreshTokenBalance
  } = useTokenBalance(address);

  const {
    withdrawTokens,
    minWithdrawalAmount
  } = useTokenWithdrawal(
    isConnected,
    tokenBalance,
    tokenContract,
    provider,
    address,
    refreshTokenBalance
  );

  // Combine all values for the context
  const value: Web3ContextType = {
    address,
    balance,
    connectWallet,
    isConnected,
    isConnecting,
    tokenBalance,
    tokenContract,
    withdrawTokens,
    refreshTokenBalance,
    minWithdrawalAmount,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Re-export useWeb3 hook for convenience
export { useWeb3 } from '@/contexts/Web3Context';
