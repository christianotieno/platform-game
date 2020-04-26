/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

let coins;
let bombs;
let roshan;
let cursors;
let score = 0;
let platforms;
let scoreText;
let movingPlatform;

const randomInt = (min, max) => Math.floor(Math.random()
    * (Math.floor(max)
    - Math.ceil(min)))
    + Math.ceil(min);

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.add.image(400, 300, 'background');

    // platform
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    platforms.create(750, 350, 'platform');
    platforms.create(400, 150, 'platform');
    platforms.create(400, 450, 'platform');
    platforms.create(50, 350, 'platform');
    platforms.create(0, 350, 'platform');


    // setting animation for moving platforms
    movingPlatform = this.physics.add.image(0, 250, 'platform');
    movingPlatform.body.allowGravity = false;
    movingPlatform.setImmovable(true);
    movingPlatform.setVelocityX(100);


    // setting up roshan
    roshan = this.physics.add.sprite(100, 450, 'roshan');
    roshan.setCollideWorldBounds(true);
    roshan.setBounce(0.2);

    // setting up roshan's animation
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

    // implementing roshan's platform colliders
    this.physics.add.collider(roshan, platforms);
    this.physics.add.collider(roshan, movingPlatform);

    cursors = this.input.keyboard.createCursorKeys();

    // coins to collect
    coins = this.physics.add.group({
      key: 'coin',
      repeat: 12,
      setXY:
    { x: 12, y: 0, stepX: 70 },
    });

    coins.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });


    // implementing coins' platform colliders
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(coins, movingPlatform);

    const collectCoin = (roshan, coin) => {
      coin.disableBody(true, true);
      score += 10;
      scoreText.setText(`Score: ${score}`);

      if (coins.countActive(true) === 0) {
        coins.children.iterate((child) => {
          child.enableBody(true, randomInt(0, 800), 0, true, true);
        });
        for (let i = 0; i < Math.round(score / 100); i += 1) {
          const bomb = this.bombs.create(Phaser.Math.Between(0, 800), 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
      }
    };

    this.physics.add.overlap(roshan, coins, collectCoin, null, this);
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // falling bombs grouping
    bombs = this.physics.add.group();

    // eslint-disable-next-line no-shadow
    const hitBomb = (roshan, bomb) => {
      // storeGolds(gold);
      this.physics.pause();
      roshan.setTint(0xff0000);
      roshan.anims.play('turn');
      // this.scene.start('gameOver');
    };

    this.physics.add.collider(roshan, bombs, hitBomb, null, this);
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
}