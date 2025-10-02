import Phaser from 'phaser';
import { FactOrFake } from '../minigames/FactOrFake';
import { AdDetective } from '../minigames/AdDetective';
import { LibraryLink } from '../minigames/LibraryLink';
import { SceneKeys } from './SceneKeys';

interface TaskProgress {
  id: string;
  label: string;
  completed: boolean;
}

export class InfoScene extends Phaser.Scene {
  private tasks: TaskProgress[] = [
    { id: 'fact', label: 'Investigate Fact or Fake', completed: false },
    { id: 'ads', label: 'Spot the ads', completed: false },
    { id: 'library', label: 'Choose a reliable source', completed: false },
    { id: 'respect', label: 'Choose a kind reply', completed: false }
  ];

  constructor() {
    super(SceneKeys.Info);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#14213d');
    const { width } = this.scale;

    this.add.text(width / 2, 16, 'Info Alley', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#e9ecef'
    }).setOrigin(0.5);

    this.add.text(width / 2, 36, 'Digital Footprints & Media Savvy', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#dee2e6'
    }).setOrigin(0.5);

    const fact = new FactOrFake(this, width / 2, 90);
    fact.setSize(220, 120);
    fact.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('fact'));

    const ads = new AdDetective(this, width / 2, 210);
    ads.setSize(220, 120);
    ads.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('ads'));

    const library = new LibraryLink(this, width / 2, 330);
    library.setSize(220, 120);
    library.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('library'));

    const respectButton = this.add.text(width / 2, 450, 'Respect Plaza: Choose kindness', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#ffb703',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);
    respectButton.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('respect'));

    this.renderChecklist();
  }

  private renderChecklist(): void {
    const { width } = this.scale;
    const checklist = this.add.container(width / 2, 520);

    const bg = this.add.rectangle(0, 0, 260, 110, 0x000000, 0.3).setOrigin(0.5);
    checklist.add(bg);

    this.tasks.forEach((task, index) => {
      const line = this.add.text(-120, -40 + index * 24, `${task.completed ? '✅' : '⬜️'} ${task.label}`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#ffffff'
      });
      checklist.add(line);
    });

    const button = this.add.text(0, 40, 'Start Mastery Check', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#8ecae6',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);
    button.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.tasks.filter((task) => task.id !== 'respect').every((task) => task.completed)) {
          this.scene.start(SceneKeys.Quiz, { topic: 'digital_footprint', returnScene: SceneKeys.Info });
        } else {
          this.showHint('Complete the learning stops first. Respect Plaza is a bonus!');
        }
      });

    checklist.add(button);
  }

  private markTaskComplete(id: string): void {
    const task = this.tasks.find((entry) => entry.id === id);
    if (task) {
      task.completed = true;
    }

    this.scene.restart();
  }

  private showHint(message: string): void {
    const { width, height } = this.scale;
    const hint = this.add.text(width / 2, height - 24, message, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      backgroundColor: '#000000',
      padding: { left: 8, right: 8, top: 4, bottom: 4 }
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => hint.destroy());
  }
}
