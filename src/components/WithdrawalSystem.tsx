import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWithdrawal } from '@/hooks/useWithdrawal';
import { usePlayerRegistration } from '@/hooks/usePlayerRegistration';
import { 
  Wallet, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Users,
  Lock
} from 'lucide-react';

const WithdrawalSystem: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const { playerData } = usePlayerRegistration();
  const {
    isSystemActive,
    isProcessing,
    withdrawalStats,
    config,
    requestWithdrawal,
    calculateFee,
    calculateNet,
    validateAmount
  } = useWithdrawal();

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount)) return;
    
    await requestWithdrawal(withdrawAmount);
    setAmount('');
  };

  const validation = amount ? validateAmount(parseFloat(amount) || 0) : { isValid: true };
  const fee = amount ? calculateFee(parseFloat(amount) || 0) : 0;
  const netAmount = amount ? calculateNet(parseFloat(amount) || 0) : 0;

  if (!playerData) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            Conecte sua carteira para acessar o sistema de saque
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status do Sistema */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSystemActive ? (
              <Wallet className="h-5 w-5 text-green-500" />
            ) : (
              <Lock className="h-5 w-5 text-yellow-500" />
            )}
            Sistema de Saque
            <Badge variant={isSystemActive ? "default" : "secondary"}>
              {isSystemActive ? "Ativo" : "Em Breve"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isSystemActive 
              ? "Retire seus tokens SKS para sua carteira"
              : `Sistema será ativado com ${config.requiredPlayerCount} jogadores`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Contador de Usuários */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="font-medium">Progresso do Sistema</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Usuários Ativos</span>
                <span className="font-medium text-white">{withdrawalStats?.activeUsers?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total de Usuários</span>
                <span className="font-medium text-white">{withdrawalStats?.totalUsers?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Meta para Ativação</span>
                <span className="font-medium text-game-token">{config.requiredPlayerCount.toLocaleString()}</span>
              </div>
              
              {/* Barra de Progresso */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progresso</span>
                  <span>{Math.round(((withdrawalStats?.activeUsers || 0) / config.requiredPlayerCount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-game-token h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((withdrawalStats?.activeUsers || 0) / config.requiredPlayerCount) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Faltam {Math.max(0, config.requiredPlayerCount - (withdrawalStats?.activeUsers || 0)).toLocaleString()} usuários ativos
                </div>
              </div>
            </div>
          </div>

          {!isSystemActive && (
            <Alert className="bg-yellow-900/20 border-yellow-700">
              <Lock className="h-4 w-4" />
              <AlertTitle>Sistema Temporariamente Bloqueado</AlertTitle>
              <AlertDescription>
                O sistema de saque será ativado automaticamente quando atingirmos {config.requiredPlayerCount.toLocaleString()} usuários ativos.
                Continue jogando e convidando amigos para acelerar o processo!
              </AlertDescription>
            </Alert>
          )}

          {/* Estatísticas do Jogador */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <DollarSign className="h-4 w-4 mx-auto mb-1 text-game-token" />
              <div className="text-sm text-gray-400">Saldo</div>
              <div className="font-semibold text-game-token">{playerData.tokensEarned} SKS</div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-400" />
              <div className="text-sm text-gray-400">Total Sacado</div>
              <div className="font-semibold">{withdrawalStats.totalWithdrawn} SKS</div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <Clock className="h-4 w-4 mx-auto mb-1 text-purple-400" />
              <div className="text-sm text-gray-400">Hoje</div>
              <div className="font-semibold">{withdrawalStats.dailyWithdrawn} SKS</div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <Wallet className="h-4 w-4 mx-auto mb-1 text-green-400" />
              <div className="text-sm text-gray-400">Solicitações</div>
              <div className="font-semibold">{withdrawalStats.totalRequests}</div>
            </div>
          </div>

          {isSystemActive && (
            <>
              <Separator className="bg-gray-700" />
              
              {/* Formulário de Saque */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Valor para Saque (SKS)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Mín: ${config.minAmount} | Máx: ${config.maxAmount}`}
                    className="bg-gray-800 border-gray-600"
                    min={config.minAmount}
                    max={Math.min(config.maxAmount, playerData.tokensEarned)}
                  />
                  {!validation.isValid && (
                    <p className="text-red-400 text-sm mt-1">{validation.error}</p>
                  )}
                </div>

                {amount && validation.isValid && (
                  <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Valor solicitado:</span>
                      <span className="font-semibold">{amount} SKS</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de processamento ({config.processingFee}%):</span>
                      <span className="text-red-400">-{fee} SKS</span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between font-semibold">
                      <span>Valor líquido:</span>
                      <span className="text-game-token">{netAmount} SKS</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleWithdraw}
                  disabled={!amount || !validation.isValid || isProcessing}
                  className="w-full bg-game-token hover:bg-game-token/80"
                >
                  {isProcessing ? "Processando..." : "Solicitar Saque"}
                </Button>
              </div>

              {/* Informações Adicionais */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-gray-400 hover:text-white"
                >
                  {showDetails ? "Ocultar" : "Mostrar"} detalhes do sistema
                </Button>
                
                {showDetails && (
                  <div className="bg-gray-800 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Valor mínimo:</span>
                      <span>{config.minAmount} SKS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor máximo:</span>
                      <span>{config.maxAmount} SKS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Limite diário:</span>
                      <span>{config.dailyLimit} SKS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de processamento:</span>
                      <span>{config.processingFee}%</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalSystem;