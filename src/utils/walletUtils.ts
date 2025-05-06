
import { ethers } from 'ethers';
import { SKS_TOKEN_CONFIG } from './tokenContract';

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Check if we're running in a mobile app context
export const isCapacitorApp = (): boolean => {
  return typeof window?.Capacitor !== 'undefined';
};

// Create MetaMask deep link for mobile
export const createMetaMaskDeepLink = (): string => {
  return `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
};

// Get provider from window.ethereum
export const getWeb3Provider = (): ethers.providers.Web3Provider | null => {
  if (!isMetaMaskInstalled()) return null;
  return new ethers.providers.Web3Provider(window.ethereum);
};

// Get ETH balance for an address
export const getEthBalance = async (address: string): Promise<string> => {
  try {
    const balance = await window.ethereum.request({ 
      method: 'eth_getBalance', 
      params: [address, 'latest'] 
    });
    
    // Convert from wei to ETH
    const ethBalance = parseInt(balance, 16) / 1e18;
    return ethBalance.toFixed(4);
  } catch (error) {
    console.error("Failed to get ETH balance:", error);
    return '0';
  }
};

// Generate appropriate error message for wallet connection
export const getWalletErrorMessage = (isMobile: boolean): string => {
  return isMobile 
    ? "Please install the MetaMask app to connect your wallet."
    : "Please install MetaMask extension to connect your wallet.";
};
