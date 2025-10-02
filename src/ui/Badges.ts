import Phaser from 'phaser';
import { saveManager } from '../save';

export class BadgesStrip extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    const { progress } = saveManager.snapshot;
    const badges: Array<[string, boolean]> = [
      ['Safety', progress.safety.cleared],
      ['Info', progress.info.cleared],
      ['Respect', progress.info.cleared],
      ['Balance', progress.finale.unlocked],
      ['Creativity', false]
    ];

    badges.forEach(([label, unlocked], index) => {
      const badge = scene.add.text(index * 48, 0, unlocked ? '🏅' : '⬜️', {
        fontSize: '20px'
      });
      const caption = scene.add.text(index * 48 - 18, 24, label, {
        fontFamily: 'sans-serif',
        fontSize: '10px',
        color: '#ffffff'
      });
      this.add([badge, caption]);
    });
  }
}
