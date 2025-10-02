import Phaser from 'phaser';

export interface BadgeStatus {
  safety: boolean;
  info: boolean;
  respect: boolean;
  balance: boolean;
  creativity: boolean;
}

export class BackpackOverlay extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, badges: BadgeStatus) {
    super(scene, x, y);
    scene.add.existing(this);

    const panel = scene.add.rectangle(0, 0, 200, 180, 0x22223b, 0.92).setOrigin(0.5);
    const title = scene.add.text(0, -70, 'Backpack of Wisdom', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#f8f9fa'
    }).setOrigin(0.5);

    const badgeEntries = Object.entries(badges);
    badgeEntries.forEach(([key, unlocked], index) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const text = scene.add.text(-80, -40 + index * 24, `${unlocked ? '🏅' : '⬜️'} ${label}`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#ffffff'
      });
      this.add(text);
    });

    this.add([panel, title]);
  }
}
