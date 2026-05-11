import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { PredictionRecord, UserStats } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const savePrediction = async (prediction: Omit<PredictionRecord, 'id' | 'userId' | 'timestamp' | 'status'>) => {
  if (!auth.currentUser) throw new Error("Authentication required");
  
  const path = 'predictions';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...prediction,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
      status: 'PENDING'
    });
    
    // Update user stats (simplified for now)
    await updateUserPredictionCount(auth.currentUser.uid);
    
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

const updateUserPredictionCount = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid,
        displayName: auth.currentUser?.displayName || 'Anonymous User',
        totalPredictions: 1,
        correctResults: 0,
        correctScores: 0,
        accuracy: 0,
        createdAt: serverTimestamp()
      });
    } else {
      const data = userDoc.data() as UserStats;
      await setDoc(userRef, {
        ...data,
        totalPredictions: (data.totalPredictions || 0) + 1
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
};

export const getUserPredictions = async (userId: string): Promise<PredictionRecord[]> => {
  const path = 'predictions';
  try {
    const q = query(
      collection(db, path), 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PredictionRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getUserStats = async (uid: string): Promise<UserStats | null> => {
  const userRef = doc(db, 'users', uid);
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return { ...userDoc.data() } as UserStats;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
};
export const getLeaderboard = async (limitCount = 10): Promise<UserStats[]> => {
  const path = 'users';
  try {
    const q = query(
      collection(db, path),
      orderBy('accuracy', 'desc'),
      orderBy('totalPredictions', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data() } as UserStats));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};
