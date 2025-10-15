import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text, Pressable, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Unityads from 'asdaily-rn-unityads';
import React, { useRef, useState, useCallback, useEffect } from 'react';

function resolveDevServerUrl() {
  const prodUrl = Constants?.expoConfig?.extra?.webappUrl;
  // Sempre prioriza a URL de produção quando configurada
  if (prodUrl) {
    const normalized = prodUrl.endsWith('/') ? prodUrl : prodUrl + '/';
    return normalized;
  }
  // Fallback para desenvolvimento local
  const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.hostUri || Constants?.manifest?.debuggerHost || '';
  const host = hostUri.split(':')[0];
  const ip = host && host.length > 0 ? host : '192.168.1.3';
  return `http://${ip}:8080/`;
}

const DEV_SERVER_URL = resolveDevServerUrl();
// URLs explícitas para controle de fallback
const PROD_URL = (Constants?.expoConfig?.extra?.webappUrl ? (Constants.expoConfig.extra.webappUrl.endsWith('/') ? Constants.expoConfig.extra.webappUrl : `${Constants.expoConfig.extra.webappUrl}/`) : null);
const LOCAL_DEV_URL = (() => {
  const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.hostUri || Constants?.manifest?.debuggerHost || '';
  const host = hostUri.split(':')[0];
  const ip = host && host.length > 0 ? host : '192.168.1.3';
  return `http://${ip}:8080/`;
})();

// Mapeamento de placements da Unity Ads por plataforma (configurável via app.json -> expo.extra.unityPlacements)
const DEFAULT_UNITY_PLACEMENTS = {
  android: {
    interstitial: 'Interstitial_Android',
    rewarded_video: 'Rewarded_Android',
    banner: 'Banner_Android',
  },
  ios: {
    interstitial: 'Interstitial_iOS',
    rewarded_video: 'Rewarded_iOS',
    banner: 'Banner_iOS',
  },
};

function getConfiguredPlacements() {
  try {
    const extra = Constants?.expoConfig?.extra || {};
    const unityPlacements = extra?.unityPlacements;
    if (unityPlacements && typeof unityPlacements === 'object') {
      return {
        android: { ...DEFAULT_UNITY_PLACEMENTS.android, ...(unityPlacements.android || {}) },
        ios: { ...DEFAULT_UNITY_PLACEMENTS.ios, ...(unityPlacements.ios || {}) },
      };
    }
  } catch {}
  return DEFAULT_UNITY_PLACEMENTS;
}

function getUnityPlacementId(adType) {
  const placements = getConfiguredPlacements();
  const platformKey = Platform.OS === 'ios' ? 'ios' : 'android';
  const key = adType === 'rewarded' || adType === 'rewarded_video' ? 'rewarded_video' : adType;
  return placements[platformKey][key] || placements[platformKey].interstitial;
}

// Exibe anúncio nativo via Unity Ads e retorna resultado
async function showNativeAd(adType) {
  const placementId = getUnityPlacementId(adType);
  return new Promise((resolve) => {
    const onShowComplete = (evt) => {
      if (!evt || evt.adUnitId !== placementId) return;
      Unityads.removeEventListener('onUnityAdsShowComplete');
      Unityads.removeEventListener('onUnityAdsShowFailed');
      Unityads.removeEventListener('onUnityAdsAdFailedToLoad');
      const state = evt?.state;
      const isCompleted = state === 1 || state === '1' || state === 2 || state === 'COMPLETED';
      const rewarded = adType === 'rewarded_video' || adType === 'rewarded' ? !!isCompleted : false;
      resolve({ rewarded });
    };

    const onShowFailed = (evt) => {
      if (!evt || evt.adUnitId !== placementId) return;
      Unityads.removeEventListener('onUnityAdsShowComplete');
      Unityads.removeEventListener('onUnityAdsShowFailed');
      Unityads.removeEventListener('onUnityAdsAdFailedToLoad');
      resolve({ rewarded: false, error: evt?.message || 'show_failed' });
    };

    const onLoadFailed = (evt) => {
      if (!evt || evt.adUnitId !== placementId) return;
      Unityads.removeEventListener('onUnityAdsShowComplete');
      Unityads.removeEventListener('onUnityAdsShowFailed');
      Unityads.removeEventListener('onUnityAdsAdFailedToLoad');
      resolve({ rewarded: false, error: evt?.message || 'load_failed' });
    };

    Unityads.addEventListener('onUnityAdsShowComplete', onShowComplete);
    Unityads.addEventListener('onUnityAdsShowFailed', onShowFailed);
    Unityads.addEventListener('onUnityAdsAdFailedToLoad', onLoadFailed);

    try {
      if (adType === 'rewarded' || adType === 'rewarded_video') {
        Unityads.loadRewarded(placementId);
      } else {
        Unityads.loadInterstitial(placementId);
      }
    } catch (e) {
      Unityads.removeEventListener('onUnityAdsShowComplete');
      Unityads.removeEventListener('onUnityAdsShowFailed');
      Unityads.removeEventListener('onUnityAdsAdFailedToLoad');
      resolve({ rewarded: false, error: 'invoke_failed' });
    }
  });
}

export default function App() {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sourceUri, setSourceUri] = useState(PROD_URL || LOCAL_DEV_URL || DEV_SERVER_URL);
  const loadTimeoutRef = useRef(null);

  useEffect(() => {
    // Inicializa Unity Ads (produção)
    const extra = Constants?.expoConfig?.extra || {};
    const ANDROID_GAME_ID = extra?.unityGameIdAndroid || '5957020';
    const IOS_GAME_ID = extra?.unityGameIdIOS || '5957021';
    const sdkKey = Platform.OS === 'ios' ? IOS_GAME_ID : ANDROID_GAME_ID;
    try {
      Unityads.initialize(sdkKey, 1, () => {
        // 0 = production, 1 = test
        // Listeners podem ser adicionados aqui conforme necessidade
      });
    } catch {}
  }, []);

  const onMessage = useCallback(async (event) => {
    try {
      const data = JSON.parse(event?.nativeEvent?.data || '{}');
      if (data?.type === 'SHOW_AD' && data?.network === 'unity') {
        console.log('[RN] SHOW_AD recebido:', data);
        const adType = data?.adType;
        const result = await showNativeAd(adType);
        const payload = { type: 'AD_RESULT', adType, rewarded: !!result?.rewarded, error: result?.error || null };
        const js = `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(payload)} })); true;`;
        webViewRef.current?.injectJavaScript?.(js);
      }
    } catch {}
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: sourceUri }}
        style={{ flex: 1 }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={'true;'}
        onLoadStart={() => {
          setLoading(true);
          setErrorMessage(null);
          if (loadTimeoutRef.current) {
            try { clearTimeout(loadTimeoutRef.current); } catch {}
          }
          loadTimeoutRef.current = setTimeout(() => {
            setErrorMessage(`Tempo limite excedido ao carregar ${sourceUri}. Verifique sua conexão ou tente novamente.`);
            setLoading(false);
          }, 15000);
        }}
        onLoadEnd={() => {
          if (loadTimeoutRef.current) {
            try { clearTimeout(loadTimeoutRef.current); } catch {}
          }
          setLoading(false);
        }}
        onError={(e) => {
          if (loadTimeoutRef.current) {
            try { clearTimeout(loadTimeoutRef.current); } catch {}
          }
          const code = e?.nativeEvent?.code;
          const desc = e?.nativeEvent?.description;
          const url = e?.nativeEvent?.url;
          setErrorMessage(`Falha ao carregar ${url || sourceUri} (code: ${code ?? 'n/a'})\n${desc ?? 'Erro desconhecido'}`);
          setLoading(false);
        }}
      />
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.overlayText}>Carregando conteúdo…</Text>
        </View>
      )}
      {errorMessage && (
        <View style={styles.overlay}> 
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable
            style={styles.reloadButton}
            onPress={() => {
              setErrorMessage(null);
              setLoading(true);
              webViewRef.current?.reload();
            }}
          >
            <Text style={styles.reloadButtonText}>Tentar novamente</Text>
          </Pressable>
          {PROD_URL && LOCAL_DEV_URL && sourceUri === PROD_URL && (
            <Pressable
              style={[styles.reloadButton, { marginTop: 10, backgroundColor: '#0ea5e9' }]}
              onPress={() => {
                setErrorMessage(null);
                setSourceUri(LOCAL_DEV_URL);
                setLoading(true);
              }}
            >
              <Text style={styles.reloadButtonText}>Usar servidor local</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.reloadButton, { marginTop: 10, backgroundColor: '#10b981' }]}
            onPress={() => {
              try { Linking.openURL(sourceUri); } catch {}
            }}
          >
            <Text style={styles.reloadButtonText}>Abrir no navegador</Text>
          </Pressable>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const TOP_INSET = Platform.OS === 'android' ? 24 : (Constants.statusBarHeight || 0);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: TOP_INSET,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  overlayText: {
    marginTop: 12,
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  reloadButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
