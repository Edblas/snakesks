
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { isMetaMaskInstalled, isCapacitorApp, createMetaMaskDeepLink, getEthBalance, getWalletErrorMessage } from '@/utils/walletUtils';
import { switchToPolygon, isPolygonNetwork } from '@/utils/polygonConfig';
import { useToast } from '@/hooks/use-toast';
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
      
      // Verificar se está na rede Polygon
      const isOnPolygon = await isPolygonNetwork();
      if (!isOnPolygon) {
        toast({
          title: "Rede incorreta",
          description: "Trocando para a rede Polygon...",
        });
        
        const switched = await switchToPolygon();
        if (!switched) {
          toast({
            title: "Erro de rede",
            description: "Não foi possível trocar para a rede Polygon. Por favor, troque manualmente.",
            variant: "destructive",
          });
          setIsConnecting(false);
          return;
        }
      }
      
      setAddress(accounts[0]);
      setIsConnected(true);
      
      // Get ETH balance
      const ethBalance = await getEthBalance(accounts[0]);
      setBalance(ethBalance);
      
      toast({
        title: "Carteira conectada",
        description: `Conectado à rede Polygon: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Falha na conexão",
        description: "Não foi possível conectar à carteira. Tente novamente.",
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
