import Phaser from 'phaser';
import { AccessibilitySettings, SCALE_STEPS } from '../config';
import { audioManager } from '../audio';
import { saveManager } from '../save';

export class SettingsPanel extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, settings: AccessibilitySettings) {
    super(scene, x, y);
    scene.add.existing(this);

    const panel = scene.add.rectangle(0, 0, 220, 200, 0x343a40, 0.92).setOrigin(0.5);
    const title = scene.add.text(0, -80, 'Settings', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const muteLabel = scene.add.text(-90, -50, `Audio: ${settings.muted ? 'Muted' : 'On'}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff'
    }).setInteractive({ useHandCursor: true });
    muteLabel.on(Phaser.Input.Events.POINTER_UP, () => {
      settings.muted = !settings.muted;
      audioManager.setMuted(settings.muted);
      muteLabel.setText(`Audio: ${settings.muted ? 'Muted' : 'On'}`);
      this.persist(settings);
    });

    const captionLabel = scene.add.text(-90, -20, `Captions: ${settings.captions ? 'On' : 'Off'}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff'
    }).setInteractive({ useHandCursor: true });
    captionLabel.on(Phaser.Input.Events.POINTER_UP, () => {
      settings.captions = !settings.captions;
      captionLabel.setText(`Captions: ${settings.captions ? 'On' : 'Off'}`);
      this.persist(settings);
    });

    const scaleLabel = scene.add.text(-90, 10, `Scale: ${settings.scale}x`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff'
    }).setInteractive({ useHandCursor: true });
    scaleLabel.on(Phaser.Input.Events.POINTER_UP, () => {
      const index = SCALE_STEPS.indexOf(settings.scale);
      const next = SCALE_STEPS[(index + 1) % SCALE_STEPS.length];
      settings.scale = next;
      scaleLabel.setText(`Scale: ${settings.scale}x`);
      this.persist(settings);
    });

    const contrastLabel = scene.add.text(-90, 40, `Contrast: ${settings.contrast === 'high' ? 'High' : 'Standard'}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff'
    }).setInteractive({ useHandCursor: true });
    contrastLabel.on(Phaser.Input.Events.POINTER_UP, () => {
      settings.contrast = settings.contrast === 'high' ? 'std' : 'high';
      contrastLabel.setText(`Contrast: ${settings.contrast === 'high' ? 'High' : 'Standard'}`);
      this.persist(settings);
    });

    const captionSpeedLabel = scene.add.text(-90, 70, `Caption Speed: ${settings.captionSpeed}`, {
      fontFamily: 'sans-serif',
      fontSize: '12px',
      color: '#ffffff'
    }).setInteractive({ useHandCursor: true });
    const speeds: AccessibilitySettings['captionSpeed'][] = ['slow', 'normal', 'fast'];
    captionSpeedLabel.on(Phaser.Input.Events.POINTER_UP, () => {
      const index = speeds.indexOf(settings.captionSpeed);
      const next = speeds[(index + 1) % speeds.length];
      settings.captionSpeed = next;
      captionSpeedLabel.setText(`Caption Speed: ${settings.captionSpeed}`);
      this.persist(settings);
    });

    this.add([panel, title, muteLabel, captionLabel, scaleLabel, contrastLabel, captionSpeedLabel]);
  }

  private persist(settings: AccessibilitySettings): void {
    saveManager.update((draft) => {
      draft.settings = { ...settings };
    });
  }
}
