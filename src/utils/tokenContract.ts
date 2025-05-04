
import { ethers } from 'ethers';

// SKS Token contract configuration
export const SKS_TOKEN_CONFIG = {
  address: '0x4507172aD2bc977FeC89C3Cff5Fa16B79856a433',
  symbol: 'SKS',
  decimals: 18,
  minWithdrawal: 1000, // Minimum withdrawal amount: 1000 tokens
};

// ABI for ERC20 token - contains only the methods we need
export const ERC20_ABI = [
  // Read methods
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  
  // Write methods
  "function transfer(address to, uint256 value) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Get contract instance
export const getTokenContract = (provider: ethers.providers.Web3Provider) => {
  return new ethers.Contract(
    SKS_TOKEN_CONFIG.address,
    ERC20_ABI,
    provider
  );
};

// Format token balance with proper decimals
export const formatTokenBalance = (balance: ethers.BigNumber): number => {
  return parseFloat(ethers.utils.formatUnits(balance, SKS_TOKEN_CONFIG.decimals));
};

// Convert tokens to wei format (for sending transactions)
export const parseTokenAmount = (amount: number): ethers.BigNumber => {
  return ethers.utils.parseUnits(amount.toString(), SKS_TOKEN_CONFIG.decimals);
};

// Check if amount meets minimum withdrawal requirement
export const meetsMinimumWithdrawal = (amount: number): boolean => {
  return amount >= SKS_TOKEN_CONFIG.minWithdrawal;
};
