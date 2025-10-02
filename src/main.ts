import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { HubScene } from './scenes/HubScene';
import { SafetyScene } from './scenes/SafetyScene';
import { InfoScene } from './scenes/InfoScene';
import { QuizScene } from './scenes/QuizScene';
import { FinaleScene } from './scenes/FinaleScene';
import { TeacherScene } from './scenes/TeacherScene';
import { SceneKeys } from './scenes/SceneKeys';

declare global {
  interface Window {
    __DC_GAME__?: Phaser.Game;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#000814',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  scene: [
    BootScene,
    TitleScene,
    HubScene,
    SafetyScene,
    InfoScene,
    QuizScene,
    FinaleScene,
    TeacherScene
  ]
};

window.addEventListener('load', () => {
  if (window.__DC_GAME__) {
    return;
  }

  window.__DC_GAME__ = new Phaser.Game(config);
});

declare const module: { hot?: { accept: () => void } };
if (module?.hot) {
  module.hot.accept?.();
}
