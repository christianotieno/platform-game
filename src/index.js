/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
import Phaser from 'phaser';
import Model from './Model';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import TitleScene from './Scenes/TitleScene';
import CreditScene from './Scenes/CreditsScene';
import OptionsScene from './Scenes/OptionsScene';
import GameScene from './Scenes/GameScene';
import aboutGameScene from './Scenes/aboutGameScene';
import PreloaderScene from './Scenes/PreloaderScene';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('aboutGame', aboutGameScene);
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

window.game = new Game();
