
import { ethers } from 'ethers';
import { ensurePolygonNetwork } from './networkConfig';

// SKS Token contract configuration on Polygon Network
export const SKS_TOKEN_CONFIG = {
  address: '0x4507172aD2bc977FeC89C3Cff5Fa16B79856a433',
  symbol: 'SKS',
  name: 'Skillswap Token',
  decimals: 18,
  totalSupply: 100000000, // 100 million tokens
  minWithdrawal: 1000, // Minimum withdrawal amount: 1000 tokens
  rewardPerGame: 5, // Tokens earned per game
  dailyLimit: 100, // Daily reward limit per player
  network: 'Polygon',
  chainId: 137,
  explorerUrl: 'https://polygonscan.com/token/0x4507172aD2bc977FeC89C3Cff5Fa16B79856a433',
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

// Get contract instance with network validation
export const getTokenContract = async (provider: ethers.providers.Web3Provider) => {
  // Ensure user is on Polygon network
  await ensurePolygonNetwork();
  
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
