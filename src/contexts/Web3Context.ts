
import { createContext, useContext } from 'react';
import { ethers } from 'ethers';

export type Web3ContextType = {
  address: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  tokenBalance: number;
  tokenContract: ethers.Contract | null;
  withdrawTokens: (amount: number, recipient: string) => Promise<boolean>;
  refreshTokenBalance: () => Promise<void>;
  minWithdrawalAmount: number;
};

export const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
