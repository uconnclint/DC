import Phaser from 'phaser';

export class AltInputHelper {
  private currentIndex = 0;
  private targets: Phaser.GameObjects.GameObject[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    this.scene.input.keyboard?.on('keydown-ESC', () => {
      this.scene.events.emit('alt-input:esc');
    });
    this.scene.input.keyboard?.on('keydown-ENTER', () => {
      const target = this.targets[this.currentIndex];
      target?.emit?.('pointerup');
    });
    this.scene.input.keyboard?.on('keydown-UP', () => this.move(-1));
    this.scene.input.keyboard?.on('keydown-DOWN', () => this.move(1));
    this.scene.input.keyboard?.on('keydown-LEFT', () => this.move(-1));
    this.scene.input.keyboard?.on('keydown-RIGHT', () => this.move(1));
  }

  registerTargets(targets: Phaser.GameObjects.GameObject[]): void {
    this.targets = targets;
    this.currentIndex = 0;
    this.highlight();
  }

  private move(delta: number): void {
    if (!this.targets.length) {
      return;
    }

    this.currentIndex = (this.currentIndex + delta + this.targets.length) % this.targets.length;
    this.highlight();
  }

  private highlight(): void {
    this.targets.forEach((target, index) => {
      target.setAlpha(index === this.currentIndex ? 1 : 0.7);
    });
  }
}
