/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';
import { getCurrentCoins } from '../localStorage';
import { submitScore } from '../api';


export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const coin = getCurrentCoins();

    this.gameOverText = this.add.text(
      260, 50, 'Your Time has Lapsed.',
      { fontSize: '26px', fill: '#eee', fontStyle: 'bold' },
    );

    this.displayCoinsCollected = this.add.text(
      200, 100, `You managed to collect ${coin} coins`,
      { fontSize: '32px', fill: '#1a578f', fontFamily: 'ariel' },
    );

    this.displayRecordScore = this.add.text(
      150, 150, 'To save your score, enter your name below.',
      { fontSize: '32px', fill: '#1a578f', fontFamily: 'ariel' },
    );

    this.add.image(400, 250, 'roshan');

    this.menuButton = new Button(
      this, 400, 550, 'blueButton1', 'blueButton2', 'Menu', 'Title',
    );

    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );
    const div = document.createElement('div');

    div.innerHTML = `
    <input type="text" id="playerName" name="playerName" placeholder="Enter your name: " class="form-control" required><br>
    <input type="submit" name="submit" value="Submit Score!" class="btn btn-warning">
    `;

    const element = this.add.dom(550, 400, div);
    element.addListener('click');
    element.on('click', (event) => {
      if (event.target.name === 'submit') {
        const inputName = document.getElementById('playerName');

        if (inputName.value !== '') {
          element.removeListener('click');
          element.setVisible(false);
          this.username = inputName.value;
          this.submit = submitScore(this.username, coin);
          this.submit.then(() => { this.scene.start('LeadersBoard'); });
        }
      }
    });
  }

  ready() {
    this.load.on('complete', () => {
      this.gameOverText.destroy();
      this.displayCoinsCollected.destroy();
      this.menuButton.destroy();
      this.element.destroy();
      this.ready();
    });
  }
}