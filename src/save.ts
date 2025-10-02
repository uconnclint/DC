import { DEFAULT_SAVE, SAVE_KEY, SaveData } from './config';

type PartialSave = Partial<SaveData> & { schema?: string };

export class SaveManager {
  private data: SaveData;

  constructor() {
    this.data = structuredClone(DEFAULT_SAVE);
    this.data = this.load();
  }

  get snapshot(): SaveData {
    return structuredClone(this.data);
  }

  update(mutator: (draft: SaveData) => void): void {
    const clone = structuredClone(this.data);
    mutator(clone);
    this.data = clone;
    this.persist();
  }

  reset(): void {
    this.data = structuredClone(DEFAULT_SAVE);
    this.persist();
  }

  private load(): SaveData {
    if (typeof window === 'undefined') {
      return structuredClone(DEFAULT_SAVE);
    }

    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) {
        return structuredClone(DEFAULT_SAVE);
      }

      const parsed = JSON.parse(raw) as PartialSave;
      if (parsed.schema !== DEFAULT_SAVE.schema) {
        return structuredClone(DEFAULT_SAVE);
      }

      return {
        ...DEFAULT_SAVE,
        ...parsed,
        settings: { ...DEFAULT_SAVE.settings, ...parsed.settings },
        progress: {
          safety: { ...DEFAULT_SAVE.progress.safety, ...parsed.progress?.safety },
          info: { ...DEFAULT_SAVE.progress.info, ...parsed.progress?.info },
          finale: { ...DEFAULT_SAVE.progress.finale, ...parsed.progress?.finale }
        }
      } satisfies SaveData;
    } catch (error) {
      console.warn('[SaveManager] Failed to parse save data', error);
      return structuredClone(DEFAULT_SAVE);
    }
  }

  private persist(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.warn('[SaveManager] Failed to persist save data', error);
    }
  }
}

export const saveManager = new SaveManager();
