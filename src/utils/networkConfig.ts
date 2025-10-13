import { ethers } from 'ethers';

// Polygon Network Configuration
export const POLYGON_NETWORK_CONFIG = {
  chainId: '0x89', // 137 in hex
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: [
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
  ],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

// Check if user is on Polygon network
export const isPolygonNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === POLYGON_NETWORK_CONFIG.chainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

// Switch to Polygon network
export const switchToPolygon = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    // Try to switch to Polygon network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_NETWORK_CONFIG.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add Polygon network to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_NETWORK_CONFIG],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Polygon network:', addError);
        return false;
      }
    } else {
      console.error('Error switching to Polygon network:', switchError);
      return false;
    }
  }
};

// Get current network info
export const getCurrentNetwork = async (): Promise<{ chainId: string; name: string } | null> => {
  if (!window.ethereum) return null;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // Map common chain IDs to names
    const networkNames: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Polygon Mumbai Testnet',
      '0x38': 'BSC Mainnet',
      '0x61': 'BSC Testnet',
    };
    
    return {
      chainId,
      name: networkNames[chainId] || `Unknown Network (${chainId})`,
    };
  } catch (error) {
    console.error('Error getting current network:', error);
    return null;
  }
};

// Ensure user is on Polygon network before token operations
export const ensurePolygonNetwork = async (): Promise<boolean> => {
  const isOnPolygon = await isPolygonNetwork();
  
  if (!isOnPolygon) {
    const switched = await switchToPolygon();
    if (!switched) {
      throw new Error('Please switch to Polygon network to use SKS tokens');
    }
  }
  
  return true;
};