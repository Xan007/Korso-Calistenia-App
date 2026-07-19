import { setAudioModeAsync } from 'expo-audio';

class AudioManager {
  private static instance: AudioManager | null = null;
  private configured = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (AudioManager.instance === null) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async configure(): Promise<void> {
    if (this.configured) return;

    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'duckOthers',
      });
      this.configured = true;
    } catch (error) {
      console.warn('Error configuring audio mode:', error);
    }
  }
}

export const audioManager = AudioManager.getInstance();
