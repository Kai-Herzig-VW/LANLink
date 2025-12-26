# PauseAlarm Feature Documentation

## Übersicht

Das PauseAlarm Feature ist eine neue Funktion in LANLink, die automatisch einen visuellen und akustischen Alarm auslöst, wenn eine Pause vorbei ist.

## Features

✅ **Visuelle Animation**
  - Pulsierender Overlay-Dialog
  - Animierte Icon und Text
  - Responsive Design für Mobile & Desktop

🔊 **Audio-Alarm**
  - Konfigurierbare Audio-Datei
  - Einstellbare Lautstärke
  - Fallback-Handling bei Wiedergabefehler

📳 **Vibration**
  - Vibrationsmuster für Mobile Geräte (wenn unterstützt)
  - Konfigurierbar im Einstellungen-File

## Konfiguration

### Audio-Link ändern

Die Audio-Datei, die beim Alarm abgespielt wird, kann einfach konfiguriert werden:

**Datei:** `src/config/pauseAlarmConfig.js`

```javascript
export const PAUSE_ALARM_CONFIG = {
  // Hier einfach den Link zur gewünschten Audio-Datei eintragen:
  audioUrl: 'https://dein-audio-url.mp3',
  
  // Audio-Lautstärke (0.0 = stumm, 1.0 = maximale Lautstärke)
  audioVolume: 0.7,
  
  // Weitere Einstellungen...
};
```

### Andere Konfigurationen

In der Datei `src/config/pauseAlarmConfig.js` können folgende Einstellungen vorgenommen werden:

- **audioVolume**: Lautstärke des Alarms (0.0 - 1.0)
- **vibrationPattern**: Vibrationsmuster für Mobile Geräte
- **animation**: Timing und Dauer der Animationen
- **colors**: Farbschema des Alarm-Dialogs

## Implementierte Komponenten

### PauseAlarm.vue
Hauptkomponente, die den Alarm-Dialog mit Animation anzeigt.

**Funktionen:**
- Automatische Berechnung der Zeit bis Pausenende
- Triggern des Alarms beim Erreichen der Pausenendzeit
- Audio-Wiedergabe und Vibration
- Dismiss-Button zum Schließen des Alarms

### pauseAlarmConfig.js
Zentrale Konfigurationsdatei für alle Alarm-Einstellungen.

## Integration

Die PauseAlarm-Komponente ist bereits in `src/App.vue` integriert und wird global auf allen Seiten angezeigt.

```vue
<template>
  <div>
    <PauseAlarm />
    <!-- Rest der App -->
  </div>
</template>
```

## Verwendete Composables

- **usePause()**: Verwaltet den Pausenstatus aus Firestore
  - `pauseEnd`: Zeitpunkt, wann die Pause endet
  - `isPaused`: Boolean, ob gerade eine Pause läuft

## Browser-Kompatibilität

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Browser

**Hinweis:** Die Vibration funktioniert nur auf mobilen Geräten und benötigt entsprechende Berechtigung.

## Troubleshooting

### Audio wird nicht abgespielt
1. Überprüfe, ob die Audio-URL erreichbar ist
2. Browser-Konsole auf Fehler prüfen
3. Sicherstellen, dass der Browser Audio-Autoplay nicht blockiert

### Vibration funktioniert nicht
- Dies ist normal auf Desktop-Geräten
- Auf mobilen Geräten: User-Interaction wird vor Vibration benötigt (z.B. Seite besucht)

## Zukünftige Erweiterungen

- [ ] Admin-Einstellung für Audio-URL in Firebase
- [ ] Multiple Audio-Optionen zur Auswahl
- [ ] Verknüpfung mit Notification API für Desktop-Benachrichtigungen
- [ ] Automatisches Schließen nach Zeitverzögerung
