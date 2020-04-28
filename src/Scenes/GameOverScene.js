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
      200, 200, 'You managed to collect coins',
      { fontSize: '32px', fill: '#1a578f', fontFamily: 'ariel' },
    );

    this.menuButton = new Button(
      this, 400, 400, 'blueButton1', 'blueButton2', 'Menu', 'Title',
    );
    this.add.image(400, 270, 'roshan');

    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );


    this.username = '';
    const div = document.createElement('div');

    div.innerHTML = `
    <input type="text" id="playerName" name="playerName" placeholder="Enter your name: " required><br><br>
    <input type="submit" name="submit" value="Submit Score!">
    `;

    const element = this.add.dom(300, 300, div);
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
        // else {}
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