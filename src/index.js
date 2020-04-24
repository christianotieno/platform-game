/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
import Phaser from 'phaser';
import Model from './Model';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import GameScene from './Scenes/GameScene';
import TitleScene from './Scenes/TitleScene';
import CreditScene from './Scenes/CreditsScene';
import OptionsScene from './Scenes/OptionsScene';
import PreloaderScene from './Scenes/PreloaderScene';

let game;
class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Boot', BootScene);
    this.scene.add('Game', GameScene);
    const model = new Model();
    this.globals = { model };
    this.scene.start('Boot');
  }
}

const resize = () => {
  const canvas = document.querySelector('canvas');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = `${windowWidth}px`;
    canvas.style.height = `${windowWidth / gameRatio}px`;
  } else {
    canvas.style.width = `${windowHeight * gameRatio}px`;
    canvas.style.height = `${windowHeight}px`;
  }
};

window.onload = function () {
  window.addEventListener('resize', resize, false);
  window.game = new Game();
  window.focus();
  resize();
};