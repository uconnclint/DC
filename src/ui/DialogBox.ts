import Phaser from 'phaser';

interface DialogOption {
  text: string;
  onSelect: () => void;
  emoji?: string;
}

export class DialogBox extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, speaker: string, message: string, options: DialogOption[] = []) {
    super(scene, x, y);
    scene.add.existing(this);

    const panel = scene.add.rectangle(0, 0, 240, 120, 0x1f1b2c, 0.95).setOrigin(0.5);
    const speakerText = scene.add.text(-110, -50, speaker, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffd166'
    });
    const messageText = scene.add.text(-110, -30, message, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      wordWrap: { width: 220 }
    });

    this.add([panel, speakerText, messageText]);

    options.forEach((option, index) => {
      const button = scene.add.text(-100, -5 + index * 22, `${option.emoji ?? ''} ${option.text}`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        backgroundColor: '#4c6ef5',
        padding: { left: 8, right: 8, top: 4, bottom: 4 }
      }).setInteractive({ useHandCursor: true });

      button.on(Phaser.Input.Events.POINTER_UP, () => option.onSelect());
      this.add(button);
    });
  }
}
