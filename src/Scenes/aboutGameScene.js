/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';
import config from '../Config/config';

export default class PreGameScene extends Phaser.Scene {
  constructor() {
    super('aboutGame');
  }

  create() {
    this.title = this.add.text(0, 0, 'Roshan, the treasure hunter.', { fontSize: '40px', fill: '#fff' });
    this.gameContext1 = this.add.text(50, 150, 'Meet Roshan. He has one task and one only, to be as rich as he can.', { fontSize: '17px', fill: '#fff' });
    this.gameContext2 = this.add.text(50, 200, 'He has to collect as many coins as possible to achieve this feat.', { fontSize: '17px', fill: '#fff' });
    this.gameContext3 = this.add.text(50, 250, 'As for the time, he has not much of it. Help him succeed.', { fontSize: '17px', fill: '#fff' });
    this.gameContext4 = this.add.text(50, 300, 'Use the arrow keys to move up the platforms.', { fontSize: '20px', fill: '#fff' });

    this.zone = this.add.zone(config.width / 2, config.height / 2, config.width, config.height);

    Phaser.Display.Align.In.Center(
      this.title,
      this.zone,
    );

    Phaser.Display.Align.In.Center(
      this.gameContext1,
      this.zone,
    );

    Phaser.Display.Align.In.Center(
      this.gameContext2,
      this.zone,
    );

    Phaser.Display.Align.In.Center(
      this.gameContext3,
      this.zone,
    );

    Phaser.Display.Align.In.Center(
      this.gameContext4,
      this.zone,
    );

    this.gameContext1.setY(400);
    this.gameContext2.setY(450);
    this.gameContext3.setY(500);
    this.gameContext4.setY(550);

    this.creditsTween = this.tweens.add({
      targets: this.title,
      y: -250,
      ease: 'Power1',
      duration: 8000,
      delay: 5000,
      onComplete() {
        this.destroy;
      },
    });

    this.madeByTween = this.tweens.add({
      targets: this.gameContext1,
      y: -150,
      ease: 'Power1',
      duration: 8000,
      delay: 5000,
      onComplete() {
        this.destroy;
      },
    });

    this.madeByTween = this.tweens.add({
      targets: this.gameContext2,
      y: -100,
      ease: 'Power1',
      duration: 8000,
      delay: 5000,
      onComplete() {
        this.destroy;
      },
    });

    this.madeByTween = this.tweens.add({
      targets: this.gameContext3,
      y: -50,
      ease: 'Power1',
      duration: 8000,
      delay: 5000,
      // eslint-disable-next-line func-names
      onComplete: function () {
        this.madeByTween.destroy;
        this.scene.start('Game');
      }.bind(this),
    });
  }
}