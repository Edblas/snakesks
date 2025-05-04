
import { useState } from 'react';

export const useSplashScreen = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  
  return {
    showSplash,
    setShowSplash,
  };
};
