<template>
  <div v-if="showAlarm" class="pause-alarm-overlay">
    <div class="pause-alarm-container">
      <!-- Giphy/Video Embed -->
      <div class="video-container" v-if="selectedVideoUrl">
        <iframe 
          :src="getVideoEmbedUrl()"
          width="100%"
          height="240"
          style="border-radius: 12px; border: 2px solid #ef4444;"
          allow="autoplay; fullscreen"
          allowfullscreen="">
        </iframe>
      </div>
      
      <h1 class="alarm-title">Break is Over!</h1>
      <p class="alarm-subtitle">Time to get back to the game!</p>
      
      <div class="pulse-circles">
        <div class="pulse-circle circle-1"></div>
        <div class="pulse-circle circle-2"></div>
        <div class="pulse-circle circle-3"></div>
      </div>
      
      <button @click="dismissAlarm" class="dismiss-btn">Dismiss</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { usePause } from '../composables/usePause';
import { PAUSE_ALARM_CONFIG } from '../config/pauseAlarmConfig';

const { pauseEnd, isPaused } = usePause();
const showAlarm = ref(false);
const selectedVideoUrl = ref(null);
let alarmTimeout = null;
let autoDismissTimeout = null;

// Helper Function: Zufälliges Video aus der Liste auswählen
function getRandomVideo() {
  if (PAUSE_ALARM_CONFIG.alarmVideos.length === 0) {
    console.warn('Keine Videos in alarmVideos konfiguriert!');
    return null;
  }
  const randomIndex = Math.floor(Math.random() * PAUSE_ALARM_CONFIG.alarmVideos.length);
  return PAUSE_ALARM_CONFIG.alarmVideos[randomIndex];
}

// Helper Function: Video Embed URL mit Loop-Count erstellen
function getVideoEmbedUrl() {
  if (!selectedVideoUrl.value) return '';
  // Giphy Clips werden 3x wiederholt durch den loop Parameter
  return `${selectedVideoUrl.value}/embed?loop=${PAUSE_ALARM_CONFIG.videoLoopCount}`;
}

watch(isPaused, (newValue) => {
  if (newValue && pauseEnd.value) {
    // Pause wurde gerade aktiviert - berechne Zeit bis Ende
    scheduleAlarm();
  } else {
    // Pause wurde deaktiviert - lösche Alarm
    clearAlarmTimeout();
    showAlarm.value = false;
  }
});

function scheduleAlarm() {
  clearAlarmTimeout();
  
  const now = new Date();
  const endTime = new Date(pauseEnd.value);
  const timeUntilEnd = endTime - now;

  if (timeUntilEnd > 0) {
    alarmTimeout = setTimeout(() => {
      triggerAlarm();
    }, timeUntilEnd);
  }
}

function triggerAlarm() {
  // Wähle zufälliges Video aus der Liste
  selectedVideoUrl.value = getRandomVideo();
  
  showAlarm.value = true;

  // Nutze Vibration API falls verfügbar
  if (navigator.vibrate) {
    navigator.vibrate(PAUSE_ALARM_CONFIG.vibrationPattern);
  }

  // Berechne Auto-Dismiss Zeit: (Video-Dauer * Loop-Count) + Verzögerung
  const totalVideoDuration = PAUSE_ALARM_CONFIG.estimatedVideoDuration * PAUSE_ALARM_CONFIG.videoLoopCount;
  const autoDismissTime = (totalVideoDuration + PAUSE_ALARM_CONFIG.autoDismissDelay) * 1000; // in Millisekunden
  
  // Automatisches Schließen nach berechneter Zeit
  autoDismissTimeout = setTimeout(() => {
    dismissAlarm();
  }, autoDismissTime);
}

function dismissAlarm() {
  showAlarm.value = false;
  selectedVideoUrl.value = null;
  
  // Clear auto-dismiss timeout falls noch aktiv
  if (autoDismissTimeout) {
    clearTimeout(autoDismissTimeout);
    autoDismissTimeout = null;
  }
}

function clearAlarmTimeout() {
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }
  if (autoDismissTimeout) {
    clearTimeout(autoDismissTimeout);
    autoDismissTimeout = null;
  }
}

onUnmounted(() => {
  clearAlarmTimeout();
});
</script>

<style scoped>
.pause-alarm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.pause-alarm-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid #ef4444;
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2);
  animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.video-container {
  margin-bottom: 1.5rem;
  animation: videoFadeIn 0.6s ease-in-out;
}

@keyframes videoFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.alarm-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: bounce 0.8s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.alarm-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.alarm-subtitle {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin: 0 0 2rem 0;
}

.pulse-circles {
  position: relative;
  height: 120px;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-circle {
  position: absolute;
  border: 3px solid #ef4444;
  border-radius: 50%;
  width: 80px;
  height: 80px;
}

.circle-1 {
  animation: pulse 2s ease-out infinite;
}

.circle-2 {
  animation: pulse 2s ease-out infinite 0.6s;
}

.circle-3 {
  animation: pulse 2s ease-out infinite 1.2s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.dismiss-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  margin-top: 1rem;
}

.dismiss-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.dismiss-btn:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .pause-alarm-container {
    padding: 2rem 1.5rem;
  }

  .alarm-title {
    font-size: 1.8rem;
  }

  .alarm-icon {
    font-size: 3.5rem;
  }

  .pulse-circle {
    width: 60px;
    height: 60px;
  }
}
</style>
