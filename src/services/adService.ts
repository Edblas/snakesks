import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdOptions, RewardedAdOptions, AdmobConsentStatus, AdmobConsentDebugGeography } from '@capacitor-community/admob';
import { gameService } from './gameService';
import { ADMOB_CONFIG } from '../config/admob';

export class AdService {
  private static instance: AdService;
  private isInitialized = false;
  private isTestMode = false; // produção por padrão

  // Detecta se está rodando dentro de um WebView React Native (Expo)
  private isRNWebView(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ReactNativeWebView;
  }

  // IDs de teste do AdMob
  private readonly TEST_IDS = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917'
  };

  // IDs de produção (definidos em src/config/admob.ts)
  private readonly PROD_IDS = {
    banner: ADMOB_CONFIG.AD_UNITS.BANNER,
    interstitial: ADMOB_CONFIG.AD_UNITS.INTERSTITIAL,
    rewarded: ADMOB_CONFIG.AD_UNITS.REWARDED
  };

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      // Se estiver no app mobile (RN WebView), não inicializa AdMob
      if (this.isRNWebView()) {
        this.isInitialized = true;
        console.log('Inicialização em RN WebView: usando Unity Ads via ponte nativa');
        return;
      }

      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['YOUR_DEVICE_ID'],
        initializeForTesting: true,
      });

      this.isTestMode = true;
      this.isInitialized = true;
      console.log('AdMob inicializado (web fallback/teste)');
    } catch (error) {
      console.error('Erro ao inicializar AdMob:', error);
      throw error;
    }
  }

  // Ponte com o app nativo via WebView
  private requestNativeAd(adType: 'rewarded_video' | 'interstitial', userId: string): Promise<number> {
    return new Promise((resolve) => {
      let resolved = false;
      const cleanup = (handler: any, timeoutId: any) => {
        try { window.removeEventListener('message', handler as any); } catch {}
        try { clearTimeout(timeoutId as any); } catch {}
      };

      const handler = async (event: MessageEvent) => {
        const data = (event as any).data;
        if (data && data.type === 'AD_RESULT' && data.adType === adType) {
          resolved = true;
          cleanup(handler, timeoutId);
          const rewarded = !!data.rewarded;
          if (rewarded) {
            const rewardTokens = adType === 'rewarded_video' ? 50 : 10;
            const tokensEarned = await gameService.rewardAdWatch(userId, adType, rewardTokens);
            resolve(tokensEarned);
          } else {
            resolve(0);
          }
        }
      };

      window.addEventListener('message', handler as any);

      // Fallback de segurança: se não houver retorno em 30s, resolver como 0
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          cleanup(handler, timeoutId);
          resolve(0);
        }
      }, 30000);

      const payload = { type: 'SHOW_AD', network: 'unity', adType, userId };
      (window as any).ReactNativeWebView?.postMessage?.(JSON.stringify(payload));
    });
  }

  async showRewardedVideo(userId: string): Promise<number> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Em RN WebView, usa Unity Ads via ponte
      if (this.isRNWebView()) {
        return await this.requestNativeAd('rewarded_video', userId);
      }

      const adId = this.TEST_IDS.rewarded; // web fallback
      const options: RewardedAdOptions = { adId, isTesting: true };

      await AdMob.prepareRewardedVideoAd(options);
      const result = await AdMob.showRewardedVideoAd();

      if (result.rewarded) {
        const tokensEarned = await gameService.rewardAdWatch(userId, 'rewarded_video', 50);
        console.log(`Usuário ${userId} ganhou ${tokensEarned} tokens por assistir anúncio`);
        return tokensEarned;
      }

      return 0;
    } catch (error) {
      console.error('Erro ao mostrar anúncio recompensado:', error);
      const tokensEarned = await gameService.rewardAdWatch(userId, 'rewarded_video', 50);
      console.log(`[SIMULADO] Usuário ${userId} ganhou ${tokensEarned} tokens`);
      return tokensEarned;
    }
  }

  async showInterstitial(userId: string): Promise<number> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Em RN WebView, usa Unity Ads via ponte
      if (this.isRNWebView()) {
        return await this.requestNativeAd('interstitial', userId);
      }

      const adId = this.TEST_IDS.interstitial; // web fallback
      const options: InterstitialAdOptions = { adId, isTesting: true };

      await AdMob.prepareInterstitialAd(options);
      await AdMob.showInterstitialAd();

      const tokensEarned = await gameService.rewardAdWatch(userId, 'interstitial', 10);
      console.log(`Usuário ${userId} ganhou ${tokensEarned} tokens por anúncio intersticial`);
      return tokensEarned;

    } catch (error) {
      console.error('Erro ao mostrar anúncio intersticial:', error);
      const tokensEarned = await gameService.rewardAdWatch(userId, 'interstitial', 10);
      console.log(`[SIMULADO] Usuário ${userId} ganhou ${tokensEarned} tokens`);
      return tokensEarned;
    }
  }

  async showBanner(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const adId = this.isTestMode ? this.TEST_IDS.banner : this.PROD_IDS.banner;
      
      const options: BannerAdOptions = {
        adId,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: this.isTestMode
      };

      await AdMob.showBanner(options);
    } catch (error) {
      console.error('Erro ao mostrar banner:', error);
    }
  }

  async hideBanner(): Promise<void> {
    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Erro ao esconder banner:', error);
    }
  }

  async isAdAvailable(adType: 'banner' | 'interstitial' | 'rewarded'): Promise<boolean> {
    try {
      // Em modo de teste ou desenvolvimento, sempre retorna true
      if (this.isTestMode || window.location.hostname === 'localhost') {
        return true;
      }

      // Implementar verificação real de disponibilidade se necessário
      return true;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do anúncio:', error);
      return false;
    }
  }

  // Método para simular anúncios em ambiente web
  private async simulateWebAd(userId: string, adType: string, tokens: number): Promise<number> {
    return new Promise((resolve) => {
      // Simular delay do anúncio
      setTimeout(async () => {
        const tokensEarned = await gameService.rewardAdWatch(userId, adType, tokens);
        console.log(`[WEB SIMULADO] Usuário ${userId} ganhou ${tokensEarned} tokens por ${adType}`);
        resolve(tokensEarned);
      }, 2000);
    });
  }
}

export const adService = AdService.getInstance();