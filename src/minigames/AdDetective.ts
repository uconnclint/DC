import Phaser from 'phaser';

export class AdDetective extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const bg = scene.add.rectangle(0, 0, 220, 120, 0xff6b6b, 0.4).setOrigin(0.5);
    const text = scene.add.text(0, 0, 'Ad Detective\n(Spot the ad clues)', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      align: 'center'
    }).setOrigin(0.5);

    this.add([bg, text]);
  }
}
