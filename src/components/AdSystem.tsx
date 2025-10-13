import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Clock, CheckCircle, Gift, X } from 'lucide-react';
import { ADMOB_CONFIG, canShowAds, getAdConfigForAge } from '@/config/admob';

interface AdSystemProps {
  onAdComplete: (reward: number) => void;
  onClose: () => void;
  isVisible: boolean;
  adType?: 'rewarded' | 'interstitial' | 'mandatory';
  userAge?: number;
  isMandatory?: boolean;
  autoStart?: boolean; // inicia automaticamente quando visível
}

export const AdSystem: React.FC<AdSystemProps> = ({ 
  onAdComplete, 
  onClose, 
  isVisible,
  adType = 'rewarded',
  userAge = 18,
  isMandatory = false,
  autoStart = isMandatory
}) => {
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [adCompleted, setAdCompleted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  // Verificar se o usuário pode ver anúncios
  const canUserSeeAds = canShowAds(userAge);
  const adConfig = getAdConfigForAge(userAge);

  useEffect(() => {
    if (isVisible && !consentGiven && ADMOB_CONFIG.COMPLIANCE.REQUIRES_CONSENT) {
      setShowConsentDialog(true);
    }
  }, [isVisible, consentGiven]);

  // Auto iniciar o anúncio quando visível (para obrigatórios ou quando autoStart=true)
  useEffect(() => {
    if (isVisible && (autoStart || isMandatory)) {
      const consentRequired = ADMOB_CONFIG.COMPLIANCE.REQUIRES_CONSENT;
      if (!consentRequired || consentGiven) {
        if (!isWatching && !adCompleted && !showConsentDialog) {
          startAd();
        }
      }
    }
  }, [isVisible, autoStart, isMandatory, consentGiven, isWatching, adCompleted, showConsentDialog]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWatching && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isWatching) {
      setAdCompleted(true);
      setIsWatching(false);
      
      // Determinar recompensa baseada no tipo de anúncio
      const reward = adType === 'rewarded' ? 50 : 0;
      onAdComplete(reward);
    }

    return () => clearInterval(interval);
  }, [isWatching, countdown, adType, onAdComplete]);

  const handleConsent = (consent: boolean) => {
    setConsentGiven(consent);
    setShowConsentDialog(false);
    
    if (!consent && !isMandatory) {
      onClose();
    }
  };

  const startAd = () => {
    if (!canUserSeeAds) {
      // Se o usuário não pode ver anúncios, simular conclusão
      onAdComplete(0);
      return;
    }

    setIsWatching(true);
    setCountdown(30);
    setAdCompleted(false);
    
    // Aqui seria integrado o SDK real do Google AdMob
    // Por enquanto, simulamos o anúncio
    const unitKey = adType === 'mandatory' 
      ? 'REWARDED' 
      : (adType.toUpperCase() as keyof typeof ADMOB_CONFIG.AD_UNITS);
    console.log(`Iniciando anúncio ${adType} com ID: ${ADMOB_CONFIG.AD_UNITS[unitKey]}`);
  };

  const claimReward = () => {
    const reward = adType === 'rewarded' ? 50 : 0;
    onAdComplete(reward);
    onClose();
  };

  const handleClose = () => {
    if (isMandatory && !adCompleted) {
      // Não permitir fechar anúncios obrigatórios
      return;
    }
    
    setIsWatching(false);
    setCountdown(30);
    setAdCompleted(false);
    onClose();
  };

  if (!isVisible) return null;

  // Dialog de consentimento GDPR/COPPA
  if (showConsentDialog) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Consentimento para Anúncios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-300 text-sm space-y-2">
              <p>Para mostrar anúncios, precisamos do seu consentimento para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Exibir anúncios personalizados baseados em seus interesses</li>
                <li>Coletar dados de uso para melhorar a experiência</li>
                <li>Compartilhar dados com parceiros publicitários</li>
              </ul>
              <p className="text-xs text-gray-400 mt-2">
                Você pode optar por anúncios não personalizados se preferir.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleConsent(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Aceitar
              </Button>
              <Button
                onClick={() => handleConsent(false)}
                variant="outline"
                className="flex-1"
                disabled={isMandatory}
              >
                {isMandatory ? 'Obrigatório' : 'Recusar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            {adType === 'rewarded' ? (
              <>
                <Gift className="text-yellow-500" size={20} />
                Ganhe Tokens SKS
              </>
            ) : (
              <>
                <Play className="text-blue-500" size={20} />
                {isMandatory ? 'Anúncio Obrigatório' : 'Anúncio'}
              </>
            )}
          </CardTitle>
          {!isMandatory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isWatching && !adCompleted && (
            <div className="text-center space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isMandatory ? 'Anúncio Obrigatório' : 'Assista um anúncio'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {isMandatory 
                    ? 'Assista este anúncio para continuar jogando'
                    : `Assista um anúncio de 30 segundos e ganhe 50 tokens SKS!`
                  }
                </p>
                {!canUserSeeAds && (
                  <p className="text-yellow-400 text-xs mt-2">
                    Idade insuficiente para anúncios. Continuando automaticamente...
                  </p>
                )}
              </div>
              
              <Button
                onClick={startAd}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="mr-2" size={16} />
                {isMandatory ? 'Continuar' : 'Assistir Anúncio'}
              </Button>
            </div>
          )}

          {isWatching && (
            <div className="text-center space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Anúncio em Andamento
                </h3>
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-400">
                  <Clock size={24} />
                  {countdown}s
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  {isMandatory 
                    ? 'Aguarde para continuar jogando...'
                    : 'Aguarde para receber sua recompensa...'
                  }
                </p>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                />
              </div>
            </div>
          )}

          {adCompleted && (
            <div className="text-center space-y-4">
              <div className="bg-green-900/50 p-4 rounded-lg border border-green-500">
                <CheckCircle className="mx-auto text-green-400 mb-2" size={48} />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isMandatory ? 'Anúncio Concluído!' : 'Parabéns!'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {isMandatory 
                    ? 'Você pode continuar jogando agora!'
                    : 'Você ganhou 50 tokens SKS!'
                  }
                </p>
              </div>
              
              <Button
                onClick={claimReward}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="mr-2" size={16} />
                {isMandatory ? 'Continuar Jogando' : 'Receber Recompensa'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSystem;