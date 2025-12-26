// useBock.js - track per-user readiness ("Ich hab Bock")
import { ref, onUnmounted } from 'vue';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useBock() {
  const { user, userProfile } = useAuth();
  const activeUserIds = ref([]); // users who currently have bock active
  let unsub = null;

  function subscribe() {
    if (unsub) unsub();
    unsub = onSnapshot(collection(db, 'bock'), (snap) => {
      const ids = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data && data.active === true) ids.push(d.id);
      });
      activeUserIds.value = ids;
    });
  }

  async function setBockActive(active) {
    if (!user.value) throw new Error('Not logged in');
    const ref = doc(db, 'bock', user.value.uid);
    if (active) {
      await setDoc(ref, { active: true, updatedAt: new Date().toISOString() });
    } else {
      // either set inactive or delete; choose delete to keep list clean
      await setDoc(ref, { active: false, updatedAt: new Date().toISOString() });
    }
  }

  async function toggleUserBock(userId, active) {
    // Allow admin toggling others
    if (!user.value) throw new Error('Not logged in');
    if (userId !== user.value.uid && !userProfile.value?.isAdmin) throw new Error('Not allowed');
    const ref = doc(db, 'bock', userId);
    await setDoc(ref, { active: !!active, updatedAt: new Date().toISOString() });
  }

  onUnmounted(() => unsub && unsub());

  return {
    activeUserIds,
    subscribe,
    setBockActive,
    toggleUserBock,
  };
}
