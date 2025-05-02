
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type Web3ContextType = {
  address: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  tokenBalance: number;
};

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Check for existing connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          // Check if already connected
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            // This would fetch actual token balance in real implementation
            setTokenBalance(Math.floor(Math.random() * 20));
            
            // Get ETH balance
            const balance = await window.ethereum.request({ 
              method: 'eth_getBalance', 
              params: [accounts[0], 'latest'] 
            });
            
            // Convert from wei to ETH
            const ethBalance = parseInt(balance, 16) / 1e18;
            setBalance(ethBalance.toFixed(4));
          }
        } catch (error) {
          console.error("Failed to connect to wallet:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setAddress(null);
          setIsConnected(false);
          setBalance('0');
        } else {
          // Account changed
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Get ETH balance
      const balance = await window.ethereum.request({ 
        method: 'eth_getBalance', 
        params: [accounts[0], 'latest'] 
      });
      
      // Convert from wei to ETH
      const ethBalance = parseInt(balance, 16) / 1e18;
      setBalance(ethBalance.toFixed(4));

      // Mock SKS token balance for demo
      setTokenBalance(Math.floor(Math.random() * 20));
      
      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const value = {
    address,
    balance,
    connectWallet,
    isConnected,
    isConnecting,
    tokenBalance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
