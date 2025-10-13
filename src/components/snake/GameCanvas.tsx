import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useSnakeGame } from '@/hooks/snake/useSnakeGame'
import { AdSystem } from '@/components/AdSystem'
import { useWeb3 } from '@/components/Web3Provider'
import { usePlayerRegistration } from '@/hooks/usePlayerRegistration'
import { useGameTokens } from '@/hooks/useGameTokens'
import { ADMOB_CONFIG } from '@/config/admob'

const SCALE = 15; // Reduzido para mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Dimensões otimizadas para mobile
const CANVAS_WIDTH = isMobile ? 300 : 400;
const CANVAS_HEIGHT = isMobile ? 300 : 400;

interface GameCanvasProps {
  onScoreUpdate: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onScoreUpdate }) => {
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  // novos estados para anúncios
  const [showAdModal, setShowAdModal] = useState(false)
  const [showMandatoryAd, setShowMandatoryAd] = useState(false)
  const [gameEndScore, setGameEndScore] = useState(0)
  const [canStartNewGame, setCanStartNewGame] = useState(true)

  const { address } = useWeb3()
  const { playerData } = usePlayerRegistration()
  const { saveScore, watchRewardedVideo, showInterstitialAd } = useGameTokens(address || 'anonymous')

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
    // salvar score e configurar anúncios pós-jogo
    setGameEndScore(finalScore)
    onScoreUpdate(finalScore)
    const playerName = playerData?.name || address || 'Jogador Anônimo'
    await saveScore(playerName, finalScore)

    const gameTime = gameStartTime ? Date.now() - gameStartTime : 0
    const shouldShowMandatoryAd = gameTime >= ADMOB_CONFIG.AD_FREQUENCY.MIN_GAME_TIME_BEFORE_AD * 1000

    if (shouldShowMandatoryAd && ADMOB_CONFIG.AD_FREQUENCY.MANDATORY_AFTER_GAME) {
      setShowMandatoryAd(true)
      setCanStartNewGame(false)
    } else {
      setCanStartNewGame(true)
    }
  })

  // Iniciar cronômetro do jogo
  const handleGameStart = () => {
    setGameStartTime(Date.now())
    setShowSplash(false)
    resetGame()
  }

  // concluir anúncio obrigatório (vídeo 30s)
  const handleMandatoryAdComplete = async () => {
    // vídeo já assistido via AdSystem; não disparar intersticial
    setShowMandatoryAd(false)
    setCanStartNewGame(true)
  }

  // concluir anúncio recompensado
  const handleRewardAdComplete = async (reward: number) => {
    if (reward > 0) {
      await watchRewardedVideo()
    }
    setShowAdModal(false)
  }

  // exibir modal de recompensa após game over
  useEffect(() => {
    if (isGameOver && gameEndScore > 0 && address && !showMandatoryAd) {
      setTimeout(() => {
        setShowAdModal(true)
      }, 2000)
    }
  }, [isGameOver, gameEndScore, address, showMandatoryAd])

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
  }, [gameStarted, isGameOver])

  return (
    <div className="game-container flex flex-col items-center justify-center min-h-screen bg-gray-900 p-2 overflow-hidden">
      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-40 pt-16 pb-20">
          <div className="text-center space-y-4 px-4 max-w-sm mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">🐍 Snake Game</h1>
            <p className="text-gray-300 mb-6 text-sm md:text-base">Toque nos botões para mover a cobra</p>
            <Button 
              onClick={handleGameStart}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 md:px-8 md:py-3 text-base md:text-lg"
              disabled={!canStartNewGame}
            >
              {canStartNewGame ? 'Iniciar Jogo' : 'Aguarde...'}
            </Button>
            {!canStartNewGame && (
              <p className="text-yellow-400 text-xs mt-2">
                Assista o anúncio para continuar jogando
              </p>
            )}
          </div>
        </div>
      )}

      {/* Score Display - Fixo no topo */}
      <div className="flex justify-between w-full max-w-sm mb-2 px-2 text-sm md:text-base">
        <div className="font-bold text-white">
          Score: <span className="text-yellow-400">{score}</span>
        </div>
        <div className="font-bold text-white">
          Recorde: <span className="text-yellow-400">{highScore}</span>
        </div>
      </div>

      {/* Game Canvas - Tamanho fixo para mobile */}
      <div className="relative mb-2 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 md:border-4 border-green-500 rounded-lg bg-gray-800"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg">
            <div className="text-center space-y-3 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Game Over!</h2>
              <p className="text-lg md:text-xl text-gray-300">Score Final: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 font-bold text-sm md:text-base">🏆 Novo Recorde!</p>
              )}
              <Button 
                onClick={() => canStartNewGame ? resetGame() : null}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 md:px-6 md:py-2 text-base md:text-lg"
                disabled={!canStartNewGame}
              >
                {canStartNewGame ? 'Jogar Novamente' : 'Aguarde o anúncio...'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Game Controls - Otimizados para touch */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Pause Button */}
        {gameStarted && !isGameOver && (
          <Button 
            onClick={togglePause}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 text-sm"
          >
            {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
          </Button>
        )}
        
        {/* Mobile Controls - Sempre visíveis e maiores */}
        {gameStarted && !isGameOver && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div></div>
            <Button 
              onClick={() => handleDirectionClick('UP')} 
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white w-14 h-14 text-2xl rounded-lg"
            >
              ⬆️
            </Button>
            <div></div>
            <Button 
              onClick={() => handleDirectionClick('LEFT')} 
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white w-14 h-14 text-2xl rounded-lg"
            >
              ⬅️
            </Button>
            <div></div>
            <Button 
              onClick={() => handleDirectionClick('RIGHT')} 
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white w-14 h-14 text-2xl rounded-lg"
            >
              ➡️
            </Button>
            <div></div>
            <Button 
              onClick={() => handleDirectionClick('DOWN')} 
              className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white w-14 h-14 text-2xl rounded-lg"
            >
              ⬇️
            </Button>
            <div></div>
          </div>
        )}

        {/* Instruções simplificadas para desktop */}
        {!isMobile && gameStarted && !isGameOver && (
          <div className="text-center text-gray-400 text-xs mt-2">
            <p>Use as setas do teclado ou WASD</p>
          </div>
        )}
      </div>

      {/* Anúncio obrigatório após o jogo */}
      <AdSystem
        isVisible={showMandatoryAd}
        onAdComplete={handleMandatoryAdComplete}
        onClose={handleMandatoryAdComplete}
        adType="mandatory"
        isMandatory={true}
        autoStart={true}
        userAge={playerData?.age || 18}
      />

      {/* Anúncio de recompensa opcional */}
      <AdSystem
        isVisible={showAdModal}
        onAdComplete={handleRewardAdComplete}
        onClose={() => setShowAdModal(false)}
        adType="rewarded"
        isMandatory={false}
        autoStart={false}
        userAge={playerData?.age || 18}
      />
    </div>
  )
}

export default GameCanvas;