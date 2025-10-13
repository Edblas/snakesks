// Configuração do Google AdMob
export const ADMOB_CONFIG = {
  // ID do aplicativo AdMob fornecido
  APP_ID: '5957020',
  
  // IDs das unidades de anúncio
  AD_UNITS: {
    // Anúncio intersticial (tela cheia) - obrigatório após cada partida
    INTERSTITIAL: '5957020',
    
    // Anúncio de recompensa - opcional para ganhar tokens extras
    REWARDED: '5957020',
    
    // Banner - opcional para exibição contínua
    BANNER: '5957020'
  },
  
  // Configurações de conformidade com políticas do Google
  COMPLIANCE: {
    // Idade mínima para consentimento (COPPA compliance)
    MIN_AGE_FOR_ADS: 13,
    
    // Requer consentimento para dados pessoais (GDPR compliance)
    REQUIRES_CONSENT: true,
    
    // Configurações de conteúdo apropriado
    CONTENT_RATING: 'T', // Teen (13+)
    
    // Categorias de anúncios bloqueadas
    BLOCKED_CATEGORIES: [
      'gambling',
      'alcohol',
      'tobacco',
      'adult_content',
      'violence'
    ],
    
    // Configurações de privacidade
    PRIVACY: {
      // Não coletar dados de localização precisa
      LOCATION_TRACKING: false,
      
      // Não usar dados sensíveis para personalização
      SENSITIVE_DATA_USAGE: false,
      
      // Permitir anúncios não personalizados
      NON_PERSONALIZED_ADS: true
    }
  },
  
  // Configurações de frequência de anúncios
  AD_FREQUENCY: {
    // Anúncio obrigatório após cada partida
    MANDATORY_AFTER_GAME: true,
    
    // Intervalo mínimo entre anúncios de recompensa (em minutos)
    REWARDED_COOLDOWN: 5,
    
    // Máximo de anúncios de recompensa por dia
    MAX_REWARDED_PER_DAY: 10,
    
    // Tempo mínimo de jogo antes do primeiro anúncio (em segundos)
    MIN_GAME_TIME_BEFORE_AD: 0
  },
  
  // Configurações de teste (usar em desenvolvimento)
  TEST_MODE: {
    ENABLED: process.env.NODE_ENV === 'development',
    TEST_DEVICE_IDS: ['YOUR_TEST_DEVICE_ID_HERE']
  }
};

// Função para verificar se o usuário pode ver anúncios
export const canShowAds = (userAge?: number): boolean => {
  if (!userAge) return false;
  return userAge >= ADMOB_CONFIG.COMPLIANCE.MIN_AGE_FOR_ADS;
};

// Função para obter configurações de anúncio baseadas na idade
export const getAdConfigForAge = (userAge: number) => {
  return {
    personalizedAds: userAge >= 18,
    contentRating: userAge >= 18 ? 'MA' : 'T',
    restrictedCategories: userAge < 18 ? ADMOB_CONFIG.COMPLIANCE.BLOCKED_CATEGORIES : []
  };
};

// Função para verificar conformidade COPPA
export const isCOPPACompliant = (userAge: number): boolean => {
  return userAge >= 13;
};

// Função para verificar se precisa de consentimento GDPR
export const requiresGDPRConsent = (userLocation?: string): boolean => {
  const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
  return !userLocation || euCountries.includes(userLocation);
};