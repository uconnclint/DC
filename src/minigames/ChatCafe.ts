import Phaser from 'phaser';

export class ChatCafe extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(0, 0, 220, 120, 0xff922b, 0.4).setOrigin(0.5);
    const text = scene.add.text(0, 0, 'Stranger Chat Café\n(Choose safe responses)', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      align: 'center'
    }).setOrigin(0.5);

    this.add([bg, text]);
  }
}
