export const GAME_WIDTH = 256;
export const GAME_HEIGHT = 192;
export const SCALE_STEPS = [1, 1.5, 2] as const;
export type ScaleSetting = (typeof SCALE_STEPS)[number];

export interface AccessibilitySettings {
  muted: boolean;
  captions: boolean;
  scale: ScaleSetting;
  contrast: 'std' | 'high';
  captionSpeed: 'slow' | 'normal' | 'fast';
}

export interface DistrictProgress {
  cleared: boolean;
  bestScore: number;
  attempts: number;
  lastAt: number;
}

export interface SaveData {
  schema: 'dcity_v1';
  settings: AccessibilitySettings;
  progress: {
    safety: DistrictProgress;
    info: DistrictProgress;
    finale: { unlocked: boolean; completed: boolean };
  };
  minutesPlayed: number;
}

export const DEFAULT_SAVE: SaveData = {
  schema: 'dcity_v1',
  settings: {
    muted: true,
    captions: true,
    scale: 1,
    contrast: 'std',
    captionSpeed: 'normal'
  },
  progress: {
    safety: { cleared: false, bestScore: 0, attempts: 0, lastAt: 0 },
    info: { cleared: false, bestScore: 0, attempts: 0, lastAt: 0 },
    finale: { unlocked: false, completed: false }
  },
  minutesPlayed: 0
};

export const SAVE_KEY = 'digital-city-save';
export const TEACHER_CODE_DEFAULT = '4321';
