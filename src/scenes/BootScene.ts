import Phaser from 'phaser';
import { SceneKeys } from './SceneKeys';
import { saveManager } from '../save';

function createSolidTexture(scene: Phaser.Scene, key: string, color: string): void {
  if (scene.textures.exists(key)) {
    return;
  }

  const size = 64;
  const rt = scene.textures.createCanvas(key, size, size);
  const ctx = rt.getContext();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  rt.refresh();
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  preload(): void {
    const { width, height } = this.scale;
    const loadingText = this.add.text(width / 2, height / 2, 'Initializing Digital City...', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#f0f0f0'
    });
    loadingText.setOrigin(0.5);

    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      createSolidTexture(this, 'backpack', '#4e8cff');
      createSolidTexture(this, 'badge-safety', '#40c057');
      createSolidTexture(this, 'dialog-panel', '#1f1b2c');
      createSolidTexture(this, 'button', '#f59f00');
    });
  }

  create(): void {
    this.time.addEvent({
      delay: 60_000,
      loop: true,
      callback: () => {
        saveManager.update((draft) => {
          draft.minutesPlayed += 1;
        });
      }
    });

    this.scene.start(SceneKeys.Title);
  }
}
