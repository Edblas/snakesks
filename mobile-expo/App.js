import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text, Pressable, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import Unityads from 'asdaily-rn-unityads';
import React, { useRef, useState, useCallback, useEffect } from 'react';

function resolveDevServerUrl() {
  const prodUrl = Constants?.expoConfig?.extra?.webappUrl;
  if (!__DEV__ && prodUrl) {
    const normalized = prodUrl.endsWith('/') ? prodUrl : prodUrl + '/';
    return normalized;
  }
  const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest?.hostUri || Constants?.manifest?.debuggerHost || '';
  const host = hostUri.split(':')[0];
  let ip = host && host.length > 0 ? host : '192.168.1.3'; // fallback para seu IP atual
  // Preferir loopback quando usamos adb reverse em Android (BlueStacks/emuladores)
  if (Platform.OS === 'android') {
    ip = '127.0.0.1';
  }
  return `http://${ip}:8080/`;
}

const DEV_SERVER_URL = resolveDevServerUrl();

// Mapeamento de placements padrão da Unity Ads por plataforma
const UNITY_PLACEMENTS = {
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

function getUnityPlacementId(adType) {
  const platformKey = Platform.OS === 'ios' ? 'ios' : 'android';
  const key = adType === 'rewarded' ? 'rewarded_video' : adType;
  return UNITY_PLACEMENTS[platformKey][key] || UNITY_PLACEMENTS[platformKey].interstitial;
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
      Unityads.loadInterstitial(placementId);
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

  useEffect(() => {
    // Inicializa Unity Ads (produção)
    const ANDROID_GAME_ID = '5957020';
    const IOS_GAME_ID = '5957021';
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
        const payload = { type: 'AD_RESULT', adType, rewarded: !!result?.rewarded };
        const js = `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(payload)} })); true;`;
        webViewRef.current?.injectJavaScript?.(js);
      }
    } catch {}
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: DEV_SERVER_URL }}
        style={{ flex: 1 }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={'true;'}
        onLoadStart={() => {
          setLoading(true);
          setErrorMessage(null);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={(e) => {
          const code = e?.nativeEvent?.code;
          const desc = e?.nativeEvent?.description;
          const url = e?.nativeEvent?.url;
          setErrorMessage(`Falha ao carregar ${url || DEV_SERVER_URL} (code: ${code ?? 'n/a'})\n${desc ?? 'Erro desconhecido'}`);
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
