/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
import './main.scss';
import Phaser from 'phaser';
import Model from './Model';
import config from './Config/config';
import BootScene from './Scenes/BootScene';
import TitleScene from './Scenes/TitleScene';
import CreditScene from './Scenes/CreditsScene';
import OptionsScene from './Scenes/OptionsScene';
import GameOverScene from './Scenes/GameOverScene';
import PreloaderScene from './Scenes/PreloaderScene';
import aboutGameScene from './Scenes/aboutGameScene';
import LeadersBoardScene from './Scenes/LeadersBoardScene';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('LeadersBoard', LeadersBoardScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('aboutGame', aboutGameScene);
    this.scene.add('GameOver', GameOverScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Boot', BootScene);
    const model = new Model();
    this.globals = { model };
    this.scene.start('Boot');
  }
}

window.game = new Game();
