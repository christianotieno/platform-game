/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

let roshan;
let cursors;


let platform;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.add.image(400, 300, 'background');

    // platform
    platform = this.physics.add.staticGroup();
    platform.create(400, 600, 'platform').setScale(2).refreshBody();

    // roshan
    roshan = this.physics.add.sprite(25, 500, 'roshan', 0);
    roshan.setBounce(0.2);
    roshan.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('roshan', { start: 7, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'roshan', frame: 8 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('roshan', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.physics.add.collider(roshan, platform);
    cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (cursors.left.isDown) {
      roshan.setVelocityX(-300);

      roshan.anims.play('left', true);
    } else if (cursors.right.isDown) {
      roshan.setVelocityX(300);

      roshan.anims.play('right', true);
    } else {
      roshan.setVelocityX(0);

      roshan.anims.play('turn');
    }

    if (cursors.up.isDown && roshan.body.touching.down) {
      roshan.setVelocityY(-330);
    }
  }
}