export interface VoiceTrack {
  key: string;
  src: string;
}

export class AudioManager {
  private muted = true;

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  playVoiceover(key: string): void {
    if (this.muted || typeof window === 'undefined') {
      return;
    }

    const audio = document.getElementById(`voice-${key}`) as HTMLAudioElement | null;
    audio?.play().catch((error) => {
      console.warn(`[AudioManager] Unable to play voiceover: ${key}`, error);
    });
  }
}

export const audioManager = new AudioManager();
