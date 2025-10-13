import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Wallet, Copy, ExternalLink } from 'lucide-react';

interface WalletRegistrationProps {
  onRegister: (address: string) => void;
  isRegistered: boolean;
  currentAddress?: string;
}

const WalletRegistration: React.FC<WalletRegistrationProps> = ({
  onRegister,
  isRegistered,
  currentAddress
}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateAddress = (address: string): boolean => {
    // Validação básica de endereço Ethereum/Polygon
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleRegister = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, cole o endereço da sua carteira.",
        variant: "destructive",
      });
      return;
    }

    if (!validateAddress(walletAddress)) {
      toast({
        title: "Endereço inválido",
        description: "Por favor, insira um endereço de carteira válido (deve começar com 0x).",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Simular validação (aqui você pode adicionar validações adicionais)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRegister(walletAddress);
      
      toast({
        title: "Registro realizado!",
        description: `Carteira ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)} registrada com sucesso!`,
      });
      
      setWalletAddress('');
    } catch (error) {
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro ao registrar sua carteira. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Endereço copiado para a área de transferência.",
    });
  };

  if (isRegistered && currentAddress) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Carteira Registrada</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
            <span className="text-sm text-gray-300">
              {currentAddress.substring(0, 6)}...{currentAddress.substring(38)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(currentAddress)}
              className="text-green-400 hover:text-green-300"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-green-400">
            <ExternalLink className="w-4 h-4" />
            <span>Pronto para jogar e ganhar tokens SKS!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold">Registrar Carteira</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Endereço da Carteira (Polygon)
          </label>
          <Input
            type="text"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
            disabled={isValidating}
          />
        </div>
        
        <Button
          onClick={handleRegister}
          disabled={isValidating || !walletAddress.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isValidating ? 'Registrando...' : 'Registrar Carteira'}
        </Button>
        
        <div className="text-xs text-gray-400 text-center">
          Cole o endereço da sua carteira Polygon para começar a ganhar tokens SKS
        </div>
      </div>
    </div>
  );
};

export default WalletRegistration;