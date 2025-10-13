
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSnakeGame } from '@/hooks/snake/useSnakeGame';
import { AdSystem } from '@/components/AdSystem';
import { useWeb3 } from '@/components/Web3Provider';
import { usePlayerRegistration } from '@/hooks/usePlayerRegistration';
import { useAdSystem } from '@/hooks/useAdSystem';
import { useGameTokens } from '@/hooks/useGameTokens';
import { ADMOB_CONFIG } from '@/config/admob';
import { Capacitor } from '@capacitor/core';

const SCALE = 20;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const { address } = useWeb3();
  const { playerData } = usePlayerRegistration();
  const { canWatchAd, watchAd } = useAdSystem();
  const { saveScore, watchRewardedVideo, showInterstitialAd, totalTokens, isWatchingAd } = useGameTokens(address || 'anonymous');
  
  const platform = Capacitor.getPlatform();
  const isNative = platform === 'ios' || platform === 'android';
  
  const [showAdModal, setShowAdModal] = useState(false);
  const [gameEndScore, setGameEndScore] = useState(0);
  const [showMandatoryAd, setShowMandatoryAd] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [canStartNewGame, setCanStartNewGame] = useState(true);
  
  const {
    canvasRef,
    snake,
    food,
    direction,
    isGameOver,
    isPaused,
    score,
    highScore,
    showControls,
    gameStarted,
    isSavingScore,
    resetGame,
    togglePause,
    handleDirectionClick,
    showSplash,
    setShowSplash,
  } = useSnakeGame(async (finalScore) => {
    setGameEndScore(finalScore);
    onScoreUpdate(finalScore);
    
    // Salvar score e ganhar tokens
    const playerName = playerData?.name || address || 'Jogador Anônimo';
    await saveScore(playerName, finalScore);
    
    // Verificar se deve mostrar anúncio obrigatório
    const gameTime = gameStartTime ? Date.now() - gameStartTime : 0;
    const shouldShowMandatoryAd = gameTime >= ADMOB_CONFIG.AD_FREQUENCY.MIN_GAME_TIME_BEFORE_AD * 1000;
    
    if (shouldShowMandatoryAd && ADMOB_CONFIG.AD_FREQUENCY.MANDATORY_AFTER_GAME) {
      // Exibir vídeo recompensado obrigatório (30s) em todas as plataformas
      setShowMandatoryAd(true);
      setCanStartNewGame(false);
    } else {
      setCanStartNewGame(true);
    }
  });

  // Iniciar cronômetro do jogo
  const handleGameStart = () => {
    setGameStartTime(Date.now());
    setShowSplash(false);
    resetGame();
  };

  // Lidar com anúncio obrigatório concluído
  const handleMandatoryAdComplete = async () => {
    // vídeo obrigatório de 30s concluído
    setShowMandatoryAd(false);
    setCanStartNewGame(true);
  };

  // Lidar com anúncio de recompensa
  const handleRewardAdComplete = async (reward: number) => {
    if (reward > 0) {
      await watchRewardedVideo();
      watchAd();
    }
    setShowAdModal(false);
  };

  // Prevent scrolling on mobile when playing
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (gameStarted && !isGameOver) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [gameStarted, isGameOver]);

  // Handle splash screen start
  const handleSplashStart = () => {
    handleGameStart();
  };

  // Show ad modal after game ends (if eligible for reward ads) - Web only
  useEffect(() => {
    if (!isNative && isGameOver && gameEndScore > 0 && canWatchAd && address && !showMandatoryAd) {
      // Small delay to show game over first
      setTimeout(() => {
        setShowAdModal(true);
      }, 2000);
    }
  }, [isNative, isGameOver, gameEndScore, canWatchAd, address, showMandatoryAd]);

  // Mandatory rewarded video after game ends - Mobile (RN WebView)
  useEffect(() => {
    if (isNative && showMandatoryAd) {
      (async () => {
        try {
          await watchRewardedVideo();
        } catch (err) {
          console.error('Falha ao exibir anúncio obrigatório:', err);
        } finally {
          // Libera novo jogo após anúncio (mesmo se falhar)
          handleMandatoryAdComplete();
        }
      })();
    }
  }, [isNative, showMandatoryAd]);

  return (
    <div className="game-ui relative flex flex-col items-center space-y-4">
      {showSplash && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white mb-4">Snake Game</h1>
            <p className="text-gray-300 mb-6">Use as setas ou WASD para mover</p>
            <Button 
              onClick={handleSplashStart}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              disabled={!canStartNewGame}
            >
              {canStartNewGame ? 'Iniciar Jogo' : 'Aguarde...'}
            </Button>
            {!canStartNewGame && (
              <p className="text-yellow-400 text-sm mt-2">
                Assista o anúncio para continuar jogando
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between w-full max-w-xs text-center">
        <div className="text-lg font-bold">Score: <span className="text-yellow-400">{score}</span></div>
        <div className="text-lg font-bold">High: <span className="text-yellow-400">{highScore}</span></div>
      </div>
      
      {/* Informações de tokens */}
      <div className="flex justify-center w-full max-w-xs text-center">
        <div className="text-lg font-bold text-green-400">
          🪙 Tokens: <span className="text-green-300">{totalTokens}</span>
        </div>
      </div>

      <div className="relative mb-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="game-canvas border-2 border-gray-700 rounded-md bg-gray-900"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-md">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Game Over!</h2>
              <p className="text-gray-300">Score: {score}</p>
              <Button 
                onClick={() => canStartNewGame ? resetGame() : null}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!canStartNewGame}
              >
                {canStartNewGame ? 'Jogar Novamente' : 'Aguarde o anúncio...'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        {gameStarted && !isGameOver && (
          <Button 
            onClick={togglePause}
            className="mb-1 bg-gray-700 hover:bg-gray-600"
            size={isMobile ? "sm" : "default"}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
        
        {/* Controles móveis */}
        {isMobile && gameStarted && !isGameOver && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div></div>
            <Button onClick={() => handleDirectionClick('UP')} className="bg-gray-700">↑</Button>
            <div></div>
            <Button onClick={() => handleDirectionClick('LEFT')} className="bg-gray-700">←</Button>
            <div></div>
            <Button onClick={() => handleDirectionClick('RIGHT')} className="bg-gray-700">→</Button>
            <div></div>
            <Button onClick={() => handleDirectionClick('DOWN')} className="bg-gray-700">↓</Button>
            <div></div>
          </div>
        )}
      </div>

      {/* Anúncio obrigatório após o jogo (somente web) */}
      {!isNative && (
        <AdSystem
          isVisible={showMandatoryAd}
          onAdComplete={handleMandatoryAdComplete}
          onClose={handleMandatoryAdComplete}
          adType="mandatory"
          isMandatory={true}
          autoStart={true}
          userAge={playerData?.age || 18}
        />
      )}

      {/* Anúncio de recompensa opcional (somente web) */}
      {!isNative && (
        <AdSystem
          isVisible={showAdModal}
          onAdComplete={handleRewardAdComplete}
          onClose={() => setShowAdModal(false)}
          adType="rewarded"
          isMandatory={false}
          autoStart={false}
          userAge={playerData?.age || 18}
        />
      )}
    </div>
  );
};

export default SnakeGame;
