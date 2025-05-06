
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ethers } from 'ethers';
import { SKS_TOKEN_CONFIG, getTokenContract, formatTokenBalance, meetsMinimumWithdrawal } from '@/utils/tokenContract';
import { useIsMobile } from '@/hooks/use-mobile';

type Web3ContextType = {
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
  const isMobile = useIsMobile();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Check if we're running in a mobile app context
  const isCapacitorApp = () => {
    return typeof (window as any)?.Capacitor !== 'undefined';
  };

  // Initialize provider and token contract
  useEffect(() => {
    if (isMetaMaskInstalled() && address) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      
      const contract = getTokenContract(web3Provider);
      setTokenContract(contract);
    }
  }, [address]);

  // Fetch token balance
  const fetchTokenBalance = async () => {
    if (!address || !tokenContract) return;
    
    try {
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = formatTokenBalance(balance);
      setTokenBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
    }
  };

  // Refresh token balance on demand
  const refreshTokenBalance = async () => {
    await fetchTokenBalance();
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

  // Update token balance when address or contract changes
  useEffect(() => {
    fetchTokenBalance();
  }, [address, tokenContract]);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setAddress(null);
          setIsConnected(false);
          setBalance('0');
          setTokenBalance(0);
          setTokenContract(null);
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

  // Open MetaMask app on mobile devices
  const connectMobileWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Create the deep link to MetaMask
      const metamaskAppDeepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
      
      // Open MetaMask app
      window.location.href = metamaskAppDeepLink;
      
      toast({
        title: "Opening MetaMask",
        description: "The MetaMask app will open. Please approve the connection.",
      });
      
      // Note: We can't track connection status here since the app will be redirected
      // The user will need to return to the app manually after connecting
    } catch (error) {
      console.error("Failed to connect mobile wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to open MetaMask. Please make sure MetaMask is installed.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    // For mobile devices in Capacitor app, use the mobile-specific connection method
    if (isMobile && isCapacitorApp()) {
      return connectMobileWallet();
    }
    
    // For web browsers with MetaMask extension
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not detected",
        description: isMobile 
          ? "Please install the MetaMask app to connect your wallet."
          : "Please install MetaMask extension to connect your wallet.",
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

  // Withdraw tokens function
  const withdrawTokens = async (amount: number, recipient: string): Promise<boolean> => {
    if (!isConnected || !tokenContract || !provider || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to withdraw tokens.",
        variant: "destructive",
      });
      return false;
    }

    // Check if amount meets minimum withdrawal
    if (!meetsMinimumWithdrawal(amount)) {
      toast({
        title: "Minimum withdrawal not met",
        description: `Minimum withdrawal amount is ${SKS_TOKEN_CONFIG.minWithdrawal} ${SKS_TOKEN_CONFIG.symbol}.`,
        variant: "destructive",
      });
      return false;
    }

    // Check if user has enough balance
    if (amount > tokenBalance) {
      toast({
        title: "Insufficient balance",
        description: `Your balance is ${tokenBalance} ${SKS_TOKEN_CONFIG.symbol}.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      // Get signer for transaction
      const signer = provider.getSigner();
      const tokenWithSigner = tokenContract.connect(signer);
      
      // Convert amount to wei format
      const amountInWei = ethers.utils.parseUnits(
        amount.toString(), 
        SKS_TOKEN_CONFIG.decimals
      );
      
      // Execute transfer
      const tx = await tokenWithSigner.transfer(recipient, amountInWei);
      
      toast({
        title: "Transaction submitted",
        description: "Please wait for confirmation...",
      });
      
      // Wait for transaction confirmation
      await tx.wait();
      
      // Refresh balance after withdrawal
      await fetchTokenBalance();
      
      toast({
        title: "Withdrawal successful",
        description: `${amount} ${SKS_TOKEN_CONFIG.symbol} transferred to ${recipient.substring(0, 6)}...${recipient.substring(38)}`,
      });
      
      return true;
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast({
        title: "Withdrawal failed",
        description: "The transaction was not successful. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value = {
    address,
    balance,
    connectWallet,
    isConnected,
    isConnecting,
    tokenBalance,
    tokenContract,
    withdrawTokens,
    refreshTokenBalance,
    minWithdrawalAmount: SKS_TOKEN_CONFIG.minWithdrawal,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
