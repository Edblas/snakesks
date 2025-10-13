import { ethers } from 'ethers';

// Polygon Network Configuration
export const POLYGON_NETWORK = {
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
  ],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

// SKS Token Configuration on Polygon
export const SKS_TOKEN_POLYGON = {
  address: '0x4507172aD2bc977FeC89C3Cff5Fa16B79856a433', // Endereço do contrato SKS
  symbol: 'SKS',
  name: 'Skillswap Token',
  decimals: 18,
  totalSupply: 100000000, // 100 milhões de tokens
  minWithdrawal: 1000, // Mínimo para saque: 1000 tokens
  dailyRewardLimit: 100, // Limite diário de recompensas por jogador
  rewardPerGame: 5, // Tokens por partida
  maxActivePlayersForWithdrawal: 2000, // Limite de jogadores ativos para liberar saque
};

// Função para adicionar/trocar para rede Polygon
export const switchToPolygon = async (): Promise<boolean> => {
  if (!window.ethereum) {
    console.error('MetaMask não encontrado');
    return false;
  }

  try {
    // Tentar trocar para Polygon
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_NETWORK.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // Se a rede não estiver adicionada, adicionar ela
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_NETWORK],
        });
        return true;
      } catch (addError) {
        console.error('Erro ao adicionar rede Polygon:', addError);
        return false;
      }
    }
    console.error('Erro ao trocar para rede Polygon:', switchError);
    return false;
  }
};

// Verificar se está na rede Polygon
export const isPolygonNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === POLYGON_NETWORK.chainId;
  } catch (error) {
    console.error('Erro ao verificar rede:', error);
    return false;
  }
};

// Obter informações da rede atual
export const getCurrentNetwork = async (): Promise<string | null> => {
  if (!window.ethereum) return null;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId;
  } catch (error) {
    console.error('Erro ao obter rede atual:', error);
    return null;
  }
};

// Formatear endereço do token para exibição
export const formatTokenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Link para o contrato no PolygonScan
export const getPolygonScanLink = (address: string): string => {
  return `https://polygonscan.com/token/${address}`;
};

// Verificar se o endereço é válido na rede Polygon
export const isValidPolygonAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address);
};