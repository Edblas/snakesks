
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/components/Web3Provider";
import Index from "./pages/Index";
import Game from "./pages/Game";
import GameInfo from "@/components/GameInfo";
import Reward from "./pages/Reward";
import TopScores from "./pages/TopScores";
import NotFound from "./pages/NotFound";
import Rewards from "./pages/Rewards";
import About from "./pages/About";
import Tokens from "./pages/Tokens";

const queryClient = new QueryClient();

const App = () => {
  const [isMobileDevice, setIsMobileDevice] = React.useState<boolean>(false);

  React.useEffect(() => {
    const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
    const mobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
    setIsMobileDevice(mobile);
  }, []);

  if (!isMobileDevice) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Web3Provider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 text-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">Snake Game SKS</h1>
                <p className="mb-2">Este aplicativo está disponível apenas em dispositivos móveis.</p>
                <p className="opacity-80">Abra no Android ou iOS (via Expo Go/Capacitor) para jogar e assistir aos anúncios.</p>
              </div>
            </div>
          </Web3Provider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Web3Provider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<GameInfo />} />
              <Route path="/game" element={<Game />} />
              <Route path="/info" element={<GameInfo />} />
              <Route path="/legacy" element={<Index />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/top-scores" element={<TopScores />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
