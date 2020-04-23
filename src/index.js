import 'phaser';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import PreloaderScene from './Scenes/PreloaderScene';
import OptionsScene from './Scenes/OptionsScene';


class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Option', OptionsScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Game', GameScene);
    this.scene.start('Game');
}


window.game = new Game();