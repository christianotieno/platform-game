/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    const backText = this.add.text(100, 500, 'Restart Game');
    backText.setInteractive({ useHandCursor: true });
    backText.on('pointerdown', () => this.restartGame());
  }

  restartGame() {
    this.scene.start('TitleScene');
  }
}