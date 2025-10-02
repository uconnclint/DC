import Phaser from 'phaser';
import { saveManager } from '../save';
import { SceneKeys } from './SceneKeys';

interface HubData {
  continueProgress?: boolean;
}

export class HubScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Hub);
  }

  create(data: HubData): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#1b1b2f');

    const subtitle = data.continueProgress ? 'Welcome back to Digital City!' : 'Welcome to Digital City!';

    this.add.text(width / 2, 32, 'Digital City Hub', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#ffd43b'
    }).setOrigin(0.5);

    this.add.text(width / 2, 60, subtitle, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#f8f9fa'
    }).setOrigin(0.5);

    const buttons = [
      this.createDistrictButton(width / 2, height / 2 - 20, 'Safety District', SceneKeys.Safety),
      this.createDistrictButton(width / 2, height / 2 + 20, 'Info Alley', SceneKeys.Info)
    ];

    const progress = saveManager.snapshot.progress;
    if (progress.safety.cleared && progress.info.cleared) {
      buttons.push(this.createDistrictButton(width / 2, height - 40, 'Finale at City Hall', SceneKeys.Finale));
    } else {
      this.add.text(width / 2, height - 40, 'Clear both districts to unlock the finale!', {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#ced4da'
      }).setOrigin(0.5);
    }

    this.createHud();
  }

  private createDistrictButton(x: number, y: number, label: string, target: SceneKeys): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#212529',
      backgroundColor: '#74c0fc',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    button.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.scene.start(target));

    return button;
  }

  private createHud(): void {
    const backpack = this.add.image(24, 24, 'backpack').setInteractive({ useHandCursor: true });
    backpack.setScale(0.5);
    backpack.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.launch(SceneKeys.Quiz, { mode: 'glossary' });
    });

    const settings = this.add.text(48, 24, '⚙️', { fontSize: '20px' }).setInteractive({ useHandCursor: true });
    settings.on(Phaser.Input.Events.POINTER_UP, () => {
      this.scene.launch(SceneKeys.Teacher, { mode: 'settings' });
    });
  }
}
