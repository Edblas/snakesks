import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBvOQhya1EQOA-DU_8VktwdRALhzNxMcWs",
  authDomain: "snake-game-tokens.firebaseapp.com",
  projectId: "snake-game-tokens",
  storageBucket: "snake-game-tokens.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;