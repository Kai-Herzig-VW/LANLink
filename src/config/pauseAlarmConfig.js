/**
 * PauseAlarm Configuration
 * 
 * Hier können alle Einstellungen für die Pause-Alarm-Funktion konfiguriert werden.
 */

export const PAUSE_ALARM_CONFIG = {
  // ⚠️ HAUPTKONFIGURATION - Videos/GIFs für den Alarm
  // Füge einfach neue URLs zum Array hinzu - ein zufälliges wird jedesmal ausgewählt!
  // Die Videos spielen ihren eigenen Sound ab!
  alarmVideos: [
    'https://giphy.com/clips/originals-funk-funky-vibes-KwFpOcGO13VNcvq9P8',
    // Weitere Videos hier einfügen:
    'https://giphy.com/clips/thesimpsons-the-simpsons-episode-3-season-32-UQxmLIaAVVW0W4F3lq',
    'https://giphy.com/clips/pbs-arts-express-yourself-dule-hill-krhhMAwDvm4IjTAW7w',
    "https://giphy.com/clips/xbox-xbox-series-x-star-wars-jedi-fallen-order-cal-kestis-3PPKDDmuelN0iSmnlq",
    "https://giphy.com/clips/hamlet-teamwork-lotr-and-my-axe-2B5kPltgtmBzQ6TcQX",
    "https://giphy.com/clips/leroypatterson-roku-the-channel-bad-ideas-X1SZ0ge7XH7c3IFr6x",
    "https://giphy.com/clips/thefastsaga-fast-and-furious-saga-7-nBZt3Coeub58xh9xMX",

    // 'https://giphy.com/...',
  ],
  
  // Anzahl der Wiederholungen des Videos
  videoLoopCount: 3,
  
  // Geschätzte Dauer eines Video-Loops in Sekunden (für Auto-Dismiss-Berechnung)
  estimatedVideoDuration: 5,
  
  // Verzögerung in Sekunden nach dem letzten Loop, bevor der Alarm automatisch verschwindet
  autoDismissDelay: 5,
  
  // Vibrations-Pattern (in Millisekunden): [vibrate, pause, vibrate, pause, ...]
  vibrationPattern: [200, 100, 200, 100, 200],
  
  // Animation-Einstellungen
  animation: {
    // Einblend-Animation Dauer (ms)
    fadeInDuration: 300,
    
    // Aufwärts-Rutscher Animation Dauer (ms)
    slideUpDuration: 500,
    
    // Icon-Bounce Animation Dauer (ms)
    bounceDuration: 800,
    
    // Puls-Kreise Animation Dauer (ms)
    pulseDuration: 2000,
  },
  
  // Farbschema
  colors: {
    borderColor: '#ef4444',      // Rot
    titleColor: '#fff',           // Weiß
    subtitleColor: '#cbd5e1',     // Grau
    buttonColor: '#ef4444',       // Rot
    buttonHoverColor: '#dc2626',  // Dunkelrot
  },
};
