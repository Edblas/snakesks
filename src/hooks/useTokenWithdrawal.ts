
import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';
import { SKS_TOKEN_CONFIG, meetsMinimumWithdrawal } from '@/utils/tokenContract';

export const useTokenWithdrawal = (
  isConnected: boolean,
  tokenBalance: number,
  tokenContract: ethers.Contract | null,
  provider: ethers.providers.Web3Provider | null,
  address: string | null,
  refreshTokenBalance: () => Promise<void>
) => {
  const { toast } = useToast();

  const withdrawTokens = useCallback(async (amount: number, recipient: string): Promise<boolean> => {
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
      await refreshTokenBalance();
      
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
  }, [isConnected, tokenContract, provider, address, tokenBalance, refreshTokenBalance, toast]);

  return {
    withdrawTokens,
    minWithdrawalAmount: SKS_TOKEN_CONFIG.minWithdrawal
  };
};
