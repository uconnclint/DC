import Phaser from 'phaser';
import { AltInputHelper } from '../input';
import { TEACHER_CODE_DEFAULT } from '../config';
import { saveManager } from '../save';
import { SceneKeys } from './SceneKeys';

export class TitleScene extends Phaser.Scene {
  private altInput!: AltInputHelper;
  private teacherHoldTimer: Phaser.Time.TimerEvent | null = null;

  constructor() {
    super(SceneKeys.Title);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#141026');
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 3, 'Digital City', {
      fontFamily: 'PressStart2P, monospace',
      fontSize: '24px',
      color: '#f4e5ff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 40, 'Grade 3 Digital Citizenship Adventures', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#f8f9fa'
    }).setOrigin(0.5);

    const buttons: Phaser.GameObjects.Text[] = [];
    const menuLabels = [
      { label: 'Continue', onClick: () => this.startGame(true) },
      { label: 'New Game', onClick: () => this.startGame(false) },
      { label: 'Options', onClick: () => this.openOptions() }
    ];

    menuLabels.forEach((entry, index) => {
      const button = this.createMenuButton(width / 2, height / 2 + index * 28, entry.label, entry.onClick);
      buttons.push(button);
    });

    this.altInput = new AltInputHelper(this);
    this.altInput.registerTargets(buttons);

    this.setupTeacherShortcut();
  }

  private createMenuButton(x: number, y: number, label: string, onClick: () => void): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#593196',
      padding: { left: 16, right: 16, top: 8, bottom: 8 }
    }).setOrigin(0.5);

    button.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_OVER, () => button.setStyle({ backgroundColor: '#7048e8' }))
      .on(Phaser.Input.Events.POINTER_OUT, () => button.setStyle({ backgroundColor: '#593196' }))
      .on(Phaser.Input.Events.POINTER_UP, () => onClick());

    return button;
  }

  private startGame(continueProgress: boolean): void {
    if (!continueProgress) {
      saveManager.reset();
    }

    this.scene.start(SceneKeys.Hub, { continueProgress });
  }

  private openOptions(): void {
    this.scene.launch(SceneKeys.Teacher, { mode: 'options-preview' });
  }

  private setupTeacherShortcut(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      return;
    }

    keyboard.on('keydown-T', () => {
      if (this.teacherHoldTimer) {
        return;
      }

      this.teacherHoldTimer = this.time.delayedCall(2000, () => {
        const code = window.prompt('Enter teacher code');
        if (code && code === TEACHER_CODE_DEFAULT) {
          this.scene.start(SceneKeys.Teacher);
        }
      });
    });

    keyboard.on('keyup-T', () => {
      this.teacherHoldTimer?.remove(false);
      this.teacherHoldTimer = null;
    });
  }
}
