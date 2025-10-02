import Phaser from 'phaser';
import { saveManager } from '../save';
import { SceneKeys } from './SceneKeys';

export class FinaleScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Finale);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0b7285');
    const { width, height } = this.scale;

    this.add.text(width / 2, 40, 'City Hall Ceremony', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#fff3bf'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, '🎉 You are an Official Digital Citizen! 🎉', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 240 }
    }).setOrigin(0.5);

    const printButton = this.add.text(width / 2, height / 2 + 20, 'Print Certificate', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#ff922b',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    printButton.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => window.print());

    const replayButton = this.add.text(width / 2, height / 2 + 60, 'Replay Districts', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#74c0fc',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);
    replayButton.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.scene.start(SceneKeys.Hub));

    saveManager.update((draft) => {
      draft.progress.finale.unlocked = true;
      draft.progress.finale.completed = true;
    });
  }
}
