import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface GameScore {
  id?: string;
  userId: string;
  playerName: string;
  score: number;
  tokensEarned: number;
  createdAt: any;
}

export interface UserProfile {
  id?: string;
  userId: string;
  playerName: string;
  totalTokens: number;
  totalScore: number;
  gamesPlayed: number;
  adsWatched: number;
  createdAt: any;
  lastPlayed: any;
}

export interface AdReward {
  id?: string;
  userId: string;
  tokensEarned: number;
  adType: 'video' | 'banner' | 'interstitial';
  createdAt: any;
}

class GameService {
  // Salvar score e calcular tokens
  async saveScore(userId: string, playerName: string, score: number): Promise<number> {
    try {
      // Calcular tokens baseado no score (1 token a cada 10 pontos)
      const tokensEarned = Math.floor(score / 10);
      
      // Salvar o score
      const scoreData: GameScore = {
        userId,
        playerName,
        score,
        tokensEarned,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'scores'), scoreData);
      
      // Atualizar perfil do usuário
      await this.updateUserProfile(userId, playerName, score, tokensEarned);
      
      return tokensEarned;
    } catch (error) {
      console.error('Erro ao salvar score:', error);
      throw error;
    }
  }

  // Atualizar perfil do usuário
  async updateUserProfile(userId: string, playerName: string, score: number, tokensEarned: number) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Usuário existe, atualizar dados
        await updateDoc(userRef, {
          totalTokens: increment(tokensEarned),
          totalScore: increment(score),
          gamesPlayed: increment(1),
          lastPlayed: serverTimestamp()
        });
      } else {
        // Novo usuário, criar perfil
        const userData: UserProfile = {
          userId,
          playerName,
          totalTokens: tokensEarned,
          totalScore: score,
          gamesPlayed: 1,
          adsWatched: 0,
          createdAt: serverTimestamp(),
          lastPlayed: serverTimestamp()
        };
        
        await updateDoc(userRef, userData);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  // Recompensar por assistir anúncio
  async rewardForAd(userId: string, adType: 'video' | 'banner' | 'interstitial'): Promise<number> {
    try {
      // Diferentes recompensas por tipo de anúncio
      const adRewards = {
        video: 50,      // 50 tokens por vídeo
        banner: 5,      // 5 tokens por banner
        interstitial: 25 // 25 tokens por interstitial
      };
      
      const tokensEarned = adRewards[adType];
      
      // Salvar recompensa do anúncio
      const adRewardData: AdReward = {
        userId,
        tokensEarned,
        adType,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'adRewards'), adRewardData);
      
      // Atualizar tokens do usuário
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalTokens: increment(tokensEarned),
        adsWatched: increment(1)
      });
      
      return tokensEarned;
    } catch (error) {
      console.error('Erro ao recompensar anúncio:', error);
      throw error;
    }
  }

  // Buscar top scores
  async getTopScores(limitCount: number = 10): Promise<GameScore[]> {
    try {
      const q = query(
        collection(db, 'scores'),
        orderBy('score', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const scores: GameScore[] = [];
      
      querySnapshot.forEach((doc) => {
        scores.push({ id: doc.id, ...doc.data() } as GameScore);
      });
      
      return scores;
    } catch (error) {
      console.error('Erro ao buscar top scores:', error);
      throw error;
    }
  }

  // Buscar perfil do usuário
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  }

  // Buscar histórico de scores do usuário
  async getUserScores(userId: string, limitCount: number = 10): Promise<GameScore[]> {
    try {
      const q = query(
        collection(db, 'scores'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const scores: GameScore[] = [];
      
      querySnapshot.forEach((doc) => {
        scores.push({ id: doc.id, ...doc.data() } as GameScore);
      });
      
      return scores;
    } catch (error) {
      console.error('Erro ao buscar scores do usuário:', error);
      throw error;
    }
  }

  // Buscar ranking de usuários por tokens
  async getTokenLeaderboard(limitCount: number = 10): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('totalTokens', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const users: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as UserProfile);
      });
      
      return users;
    } catch (error) {
      console.error('Erro ao buscar ranking de tokens:', error);
      throw error;
    }
  }
}

export const gameService = new GameService();