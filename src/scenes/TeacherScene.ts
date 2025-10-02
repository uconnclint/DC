import Phaser from 'phaser';
import { saveManager } from '../save';
import { SceneKeys } from './SceneKeys';

interface TeacherData {
  mode?: 'settings' | 'options-preview';
}

export class TeacherScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Rectangle;

  constructor() {
    super(SceneKeys.Teacher);
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#03045e');

    this.background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_UP, () => this.close());

    const panel = this.add.rectangle(width / 2, height / 2, width - 20, height - 20, 0x212529, 0.95);
    const title = this.add.text(width / 2, 40, 'Teacher Dashboard (Local)', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const save = saveManager.snapshot;

    const stats = [
      `Minutes played: ${save.minutesPlayed}`,
      `Safety District — cleared: ${save.progress.safety.cleared ? 'yes' : 'no'}, best score: ${save.progress.safety.bestScore}, attempts: ${save.progress.safety.attempts}`,
      `Info Alley — cleared: ${save.progress.info.cleared ? 'yes' : 'no'}, best score: ${save.progress.info.bestScore}, attempts: ${save.progress.info.attempts}`,
      `Finale unlocked: ${save.progress.finale.unlocked ? 'yes' : 'no'}`
    ];

    stats.forEach((line, index) => {
      this.add.text(40, 80 + index * 24, line, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#f8f9fa'
      });
    });

    const exportButton = this.add.text(width / 2, height - 80, 'Export Progress JSON', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#38b000',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);
    exportButton.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        const data = JSON.stringify(save, null, 2);
        window.prompt('Copy your progress data:', data);
      });

    const importButton = this.add.text(width / 2, height - 40, 'Import Progress JSON', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#f77f00',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);
    importButton.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        const raw = window.prompt('Paste save JSON');
        if (!raw) {
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          window.localStorage.setItem('digital-city-save', JSON.stringify(parsed));
          this.add.text(width / 2, height / 2, 'Imported! Reload game to apply.', {
            fontFamily: 'sans-serif',
            fontSize: '12px',
            color: '#ffffff',
            backgroundColor: '#2b9348',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
          }).setOrigin(0.5);
        } catch (error) {
          console.warn('Failed to import save', error);
          this.add.text(width / 2, height / 2, 'Import failed. Check JSON format.', {
            fontFamily: 'sans-serif',
            fontSize: '12px',
            color: '#ffffff',
            backgroundColor: '#d00000',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
          }).setOrigin(0.5);
        }
      });

    this.input.keyboard?.on('keydown-ESC', () => this.close());
  }

  private close(): void {
    this.scene.stop(SceneKeys.Teacher);
  }
}
