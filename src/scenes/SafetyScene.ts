import Phaser from 'phaser';
import { PasswordPuzzle } from '../minigames/PasswordPuzzle';
import { ChatCafe } from '../minigames/ChatCafe';
import { PopUpArcade } from '../minigames/PopUpArcade';
import { SceneKeys } from './SceneKeys';

interface TaskProgress {
  id: string;
  label: string;
  completed: boolean;
}

export class SafetyScene extends Phaser.Scene {
  private tasks: TaskProgress[] = [
    { id: 'password', label: 'Build a strong password', completed: false },
    { id: 'chat', label: 'Practice stranger chat safety', completed: false },
    { id: 'popups', label: 'Shut down scam pop-ups', completed: false }
  ];

  constructor() {
    super(SceneKeys.Safety);
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#264653');
    const { width } = this.scale;

    this.add.text(width / 2, 16, 'Safety District', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#f1faee'
    }).setOrigin(0.5);

    this.add.text(width / 2, 36, 'Personal vs Private Information', {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#f8f9fa'
    }).setOrigin(0.5);

    const password = new PasswordPuzzle(this, width / 2, 90);
    password.setSize(220, 120);
    password.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('password'));

    const chat = new ChatCafe(this, width / 2, 210);
    chat.setSize(220, 120);
    chat.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('chat'));

    const popups = new PopUpArcade(this, width / 2, 330);
    popups.setSize(220, 120);
    popups.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => this.markTaskComplete('popups'));

    this.renderChecklist();
  }

  private renderChecklist(): void {
    const { width } = this.scale;
    const checklistY = 360;
    const checklist = this.add.container(width / 2, checklistY);

    const bg = this.add.rectangle(0, 0, 240, 90, 0x000000, 0.3).setOrigin(0.5);
    checklist.add(bg);

    this.tasks.forEach((task, index) => {
      const line = this.add.text(-100, -30 + index * 24, `${task.completed ? '✅' : '⬜️'} ${task.label}`, {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#ffffff'
      });
      checklist.add(line);
    });

    const button = this.add.text(0, 32, 'Start Mastery Check', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: '#2a9d8f',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    button.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (this.tasks.every((task) => task.completed)) {
          this.scene.start(SceneKeys.Quiz, { topic: 'personal_private', returnScene: SceneKeys.Safety });
        } else {
          this.showHint('Try each activity before the quiz.');
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
