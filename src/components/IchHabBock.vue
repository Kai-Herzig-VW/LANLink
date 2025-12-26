<template>
  <div class="card bock-card">
    <h3>Ich hab Bock</h3>
    <div class="users-list">
      <div v-for="u in users" :key="u.id" class="user-row">
        <span class="user-name">{{ u.displayName || u.email || u.id }}</span>
        <button
          class="pc-icon"
          :class="isActive(u.id) ? 'colored' : 'grey'"
          :title="isActive(u.id) ? 'Bereit' : 'Nicht bereit'"
          :disabled="!canToggle(u.id)"
          @click="onToggle(u.id)"
        ></button>
      </div>
    </div>

    <div class="available-games">
      <h4>Verfügbare Spiele für die aktiven Spieler</h4>
      <div v-if="activeUserIds.length === 0" class="note">Wähle oben, wer Lust hat zu spielen.</div>
      <table v-else class="gamelist-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Max Players</th>
            <th>Installiert von</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in filteredGames" :key="g.id">
            <td class="g-title">{{ g.title }}</td>
            <td class="g-max">{{ g.maxPlayers || '?' }}</td>
            <td class="g-installed-by">
              <span v-if="g.installedByUsers && g.installedByUsers.length" class="installed-by-list">
                <span v-for="user in g.installedByUsers" :key="user.id" class="pill pill-grey">{{ user.displayName || user.email || user.id }}</span>
              </span>
              <span v-else style="color:#6b7280;">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUsers } from '../composables/useUsers';
import { useBock } from '../composables/useBock';
import { useAuth } from '../composables/useAuth';
import { useGames } from '../composables/useGames';

const { users, subscribe: subscribeUsers } = useUsers();
const { activeUserIds, subscribe: subscribeBock, toggleUserBock } = useBock();
const { userProfile, user } = useAuth();
const { games, subscribe: subscribeGames } = useGames();

onMounted(() => {
  subscribeUsers();
  subscribeBock();
  subscribeGames();
});

function isActive(uid) {
  return activeUserIds.value.includes(uid);
}
function canToggle(targetUid) {
  return !!user.value && (user.value.uid === targetUid || userProfile.value?.isAdmin);
}
async function onToggle(targetUid) {
  const next = !isActive(targetUid);
  await toggleUserBock(targetUid, next);
}

const filteredGames = computed(() => {
  const active = activeUserIds.value;
  if (!active.length) return [];
  // A game is available if all active users are in installedByUsers ids
  return games.value.filter((g) => {
    const ids = (g.installedByUsers || []).map(u => u.id);
    return active.every(uid => ids.includes(uid));
  });
});
</script>

<style scoped>
.bock-card {
  padding: 16px;
}
.users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #111827;
  border-radius: 8px;
}
.user-name {
  font-weight: 600;
}
.pc-icon {
  position: relative;
  width: 1.8em;
  height: 1.8em;
  padding: 0;
}
.pc-icon::before {
  content: "\1F4BB"; /* 💻 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2em;
  font-weight: bold;
}
.pc-icon.grey::before { color: #6b7280; }
.pc-icon.colored::before { color: #2563eb; }

/* Reuse minimal table styles from Gamelist */
.gamelist-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}
.gamelist-table th, .gamelist-table td {
  padding: 10px 12px;
  text-align: left;
}
.gamelist-table th { color: #9aa3b2; font-weight: 600; }
.gamelist-table tbody tr { border-top: 1px solid #1f2937; }
.gamelist-table tbody tr:hover { background: #0b1220; }
.gamelist-table td { vertical-align: middle; }
.pill { display:inline-block; padding:2px 8px; border-radius:999px; background:#374151; font-size:0.85em; }
.pill-grey { background:#374151; color:#e5e7eb; }
.note { color:#9aa3b2; }
</style>
