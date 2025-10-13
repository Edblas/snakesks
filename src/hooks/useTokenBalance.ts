
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SKS_TOKEN_CONFIG, getTokenContract, formatTokenBalance } from '@/utils/tokenContract';
import { isMetaMaskInstalled } from '@/utils/walletUtils';

export const useTokenBalance = (address: string | null) => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Initialize provider and token contract
  useEffect(() => {
    const initializeContract = async () => {
      if (isMetaMaskInstalled() && address) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        
        try {
          const contract = await getTokenContract(web3Provider);
          setTokenContract(contract);
        } catch (error) {
          console.error("Failed to initialize token contract:", error);
        }
      }
    };
    
    initializeContract();
  }, [address]);

  // Fetch token balance
  const fetchTokenBalance = useCallback(async () => {
    if (!address || !tokenContract) return;
    
    try {
      const balance = await tokenContract.balanceOf(address);
      const formattedBalance = formatTokenBalance(balance);
      setTokenBalance(formattedBalance);
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
    }
  }, [address, tokenContract]);

  // Refresh token balance on demand
  const refreshTokenBalance = useCallback(async () => {
    await fetchTokenBalance();
  }, [fetchTokenBalance]);

  // Update token balance when address or contract changes
  useEffect(() => {
    fetchTokenBalance();
  }, [address, tokenContract, fetchTokenBalance]);

  return {
    tokenBalance,
    tokenContract,
    provider,
    refreshTokenBalance
  };
};
