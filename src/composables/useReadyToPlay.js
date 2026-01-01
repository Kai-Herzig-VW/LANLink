// useReadyToPlay.js - composable for ready to play status
import { ref, watchEffect } from 'vue';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useReadyToPlay() {
  const { user, userProfile } = useAuth();
  const readyToPlayAt = ref(null);
  let unsubscribe = null;

  watchEffect(() => {
    if (user.value?.uid) {
      const userDoc = doc(db, 'users', user.value.uid);
      unsubscribe = onSnapshot(userDoc, (snap) => {
        readyToPlayAt.value = snap.data()?.readyToPlayAt || null;
      });
    } else {
      readyToPlayAt.value = null;
      if (unsubscribe) unsubscribe();
    }
  });

  async function setReadyToPlay(isReady) {
    if (!user.value?.uid) return;
    const userDoc = doc(db, 'users', user.value.uid);
    await setDoc(userDoc, {
      readyToPlayAt: isReady ? serverTimestamp() : null
    }, { merge: true });
  }

  return {
    readyToPlayAt,
    setReadyToPlay
  };
}
