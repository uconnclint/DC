import Phaser from 'phaser';
import { saveManager } from '../save';
import ppiQuestions from '../data/questions_ppi.json';
import footprintQuestions from '../data/questions_footprint.json';
import { SceneKeys } from './SceneKeys';

interface QuizData {
  topic: 'personal_private' | 'digital_footprint';
  returnScene?: SceneKeys;
  mode?: 'glossary';
}

interface QuestionItem {
  id: string;
  objective: string;
  stem: string;
  choices: string[];
  answer: number;
  rationale: string;
  voiceover: string;
}

export class QuizScene extends Phaser.Scene {
  private questions: QuestionItem[] = [];
  private index = 0;
  private score = 0;
  private topic: QuizData['topic'] | null = null;
  private returnScene: SceneKeys | undefined;

  constructor() {
    super(SceneKeys.Quiz);
  }

  init(data: QuizData): void {
    this.topic = data.topic ?? null;
    this.returnScene = data.returnScene;
    this.questions = this.prepareQuestions(data.topic);
    this.index = 0;
    this.score = 0;
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#10002b');
    const { width, height } = this.scale;

    this.add.text(width / 2, 24, this.topic === 'personal_private' ? 'Safety District Mastery Check' : 'Info Alley Mastery Check', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#f8f9fa'
    }).setOrigin(0.5);

    if (!this.topic) {
      this.add.text(width / 2, height / 2, 'Glossary and Backpack content coming soon!', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 240 }
      }).setOrigin(0.5);
      return;
    }

    this.renderQuestion();
  }

  private prepareQuestions(topic: QuizData['topic']): QuestionItem[] {
    const pool = topic === 'personal_private' ? ppiQuestions : footprintQuestions;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  }

  private renderQuestion(): void {
    const { width } = this.scale;
    const question = this.questions[this.index];
    if (!question) {
      this.completeQuiz();
      return;
    }

    this.children.removeAll();

    this.add.text(width / 2, 60, `Question ${this.index + 1} of ${this.questions.length}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ced4da'
    }).setOrigin(0.5);

    this.add.text(width / 2, 120, question.stem, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 240 }
    }).setOrigin(0.5);

    question.choices.forEach((choice, idx) => {
      const button = this.add.text(width / 2, 200 + idx * 40, choice, {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        backgroundColor: '#4c6ef5',
        padding: { left: 12, right: 12, top: 6, bottom: 6 }
      }).setOrigin(0.5);

      button.setInteractive({ useHandCursor: true })
        .once(Phaser.Input.Events.POINTER_UP, () => this.resolveAnswer(idx));
    });
  }

  private resolveAnswer(choiceIndex: number): void {
    const question = this.questions[this.index];
    if (!question) {
      return;
    }

    const correct = question.answer === choiceIndex;
    if (correct) {
      this.score += 1;
    }

    const { width } = this.scale;
    const feedback = this.add.text(width / 2, 320, correct ? 'Great job!' : 'Let\'s review!', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: correct ? '#2b8a3e' : '#c92a2a',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    const rationale = this.add.text(width / 2, 360, question.rationale, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 240 }
    }).setOrigin(0.5);

    this.time.delayedCall(1800, () => {
      feedback.destroy();
      rationale.destroy();
      this.index += 1;
      this.renderQuestion();
    });
  }

  private completeQuiz(): void {
    const passThreshold = Math.ceil(this.questions.length * 0.8);
    const passed = this.score >= passThreshold;
    this.recordAttempt(passed);
    const { width, height } = this.scale;

    this.children.removeAll();

    this.add.text(width / 2, height / 2 - 40, passed ? 'Mission Complete!' : 'Let\'s Try Again!', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, `Score: ${this.score} / ${this.questions.length}`, {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#f8f9fa'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 30, `Need ${passThreshold}+ to pass`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ced4da'
    }).setOrigin(0.5);

    const retry = this.add.text(width / 2, height / 2 + 70, passed ? 'Return to Hub' : 'Retry Quiz', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      backgroundColor: passed ? '#51cf66' : '#fab005',
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    }).setOrigin(0.5);

    retry.setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        if (passed) {
          this.scene.start(SceneKeys.Hub);
        } else {
          this.scene.restart({ topic: this.topic, returnScene: this.returnScene });
        }
      });

    if (!passed) {
      const review = this.add.text(width / 2, height / 2 + 110, 'Review district activities then try again.', {
        fontFamily: 'sans-serif',
        fontSize: '12px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 240 }
      }).setOrigin(0.5);
    }
  }

  private recordAttempt(passed: boolean): void {
    if (!this.topic) {
      return;
    }

    saveManager.update((draft) => {
      const district = this.topic === 'personal_private' ? draft.progress.safety : draft.progress.info;
      district.attempts += 1;
      district.bestScore = Math.max(district.bestScore, this.score);
      district.lastAt = Date.now();
      if (passed) {
        district.cleared = true;
        if (draft.progress.safety.cleared && draft.progress.info.cleared) {
          draft.progress.finale.unlocked = true;
        }
      }
    });
  }
}
