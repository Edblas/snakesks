
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { isMetaMaskInstalled, isCapacitorApp, createMetaMaskDeepLink, getEthBalance, getWalletErrorMessage } from '@/utils/walletUtils';
import { useIsMobile } from './use-mobile';

export const useWalletConnection = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Connect to mobile wallet with deep link
  const connectMobileWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Create and use the deep link to MetaMask
      const metamaskAppDeepLink = createMetaMaskDeepLink();
      window.location.href = metamaskAppDeepLink;
      
      toast({
        title: "Opening MetaMask",
        description: "The MetaMask app will open. Please approve the connection.",
      });
      
      // Note: We can't track connection status here since the app will be redirected
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

  // Main connect wallet function
  const connectWallet = async () => {
    // For mobile devices in Capacitor app, use the mobile-specific connection method
    if (isMobile && isCapacitorApp()) {
      return connectMobileWallet();
    }
    
    // For web browsers with MetaMask extension
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not detected",
        description: getWalletErrorMessage(isMobile),
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
      const ethBalance = await getEthBalance(accounts[0]);
      setBalance(ethBalance);
      
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
            const ethBalance = await getEthBalance(accounts[0]);
            setBalance(ethBalance);
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

  return {
    address,
    balance,
    isConnected,
    isConnecting,
    connectWallet,
    setAddress,
    setBalance,
    setIsConnected
  };
};
