/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

let roshan;
let cursors;
let coins;
let platforms;
let movingPlatform;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.add.image(400, 300, 'background');

    // platform
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();

    platforms.create(400, 450, 'platform');
    platforms.create(50, 350, 'platform');
    platforms.create(750, 350, 'platform');
    platforms.create(0, 350, 'platform');
    platforms.create(400, 150, 'platform');


    // setting movingPlatform animation
    movingPlatform = this.physics.add.image(0, 250, 'platform');

    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityX(100);


    // adding roshan
    roshan = this.physics.add.sprite(100, 450, 'roshan');
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
    cursors = this.input.keyboard.createCursorKeys();

    coins = this.physics.add.group({
      key: 'coin',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    coins.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(roshan, platforms);
    this.physics.add.collider(roshan, movingPlatform);
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(coins, movingPlatform);

    this.physics.add.overlap(roshan, coins, this.collectCoin, null, this);
  }

  update() {
    if (cursors.left.isDown) {
      roshan.setVelocityX(-160);

      roshan.anims.play('left', true);
    } else if (cursors.right.isDown) {
      roshan.setVelocityX(160);

      roshan.anims.play('right', true);
    } else {
      roshan.setVelocityX(0);

      roshan.anims.play('turn');
    }

    if (cursors.up.isDown && roshan.body.touching.down) {
      roshan.setVelocityY(-330);
    }

    if (movingPlatform.x >= 500) {
      movingPlatform.setVelocityX(-50);
    } else if (movingPlatform.x <= 300) {
      movingPlatform.setVelocityX(50);
    }
  }

  collectCoin(roshan, coin) {
    coin.disableBody(true, true);
  }
}