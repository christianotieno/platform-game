/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';
import storeCoins from '../localStorage';


const randomInt = (min, max) => Math.floor(Math.random()
  * (Math.floor(max)
  - Math.ceil(min)))
  + Math.ceil(min);
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');

    this.score = 0;
    this.gameOver = false;
    this.initialTime = 30;
    this.timerText = '';
    this.timedEvent = '';
  }

  // ==============================================================================================
  // Create
  create() {
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);

    this.createMovingPlatforms();
    this.createPlatforms();
    this.createRoshan();
    this.createCursor();
    this.createCoins();

    this.scoreText = this.add.text(
      16, 16, 'Score: 0',
      { fontSize: '32px', fill: '#f05123', fontStyle: 'bold' },
    );
    this.timerText = this.add.text(
      550, 16, `Time Lapse: ${this.initialTime}`,
      { fontSize: '28px', fill: '#eee', fontStyle: 'bold' },
    );

    const onEvent = () => {
      do {
        this.initialTime -= 1;
        this.timerText.setText(`Time Lapse: ${this.initialTime}`);
      }
      while (this.initialTime < 0);
      if (this.initialTime === 0) {
        storeCoins(this.score);
        this.scene.start('GameOver');
      }
    };

    this.timedEvent = this.time.addEvent({
      delay: 1000, callback: onEvent, callbackScope: this, loop: true,
    });
  }


  createMovingPlatforms() {
    this.movingPlatform = this.physics.add.image(0, 250, 'platform');
    this.movingPlatform.body.allowGravity = false;
    this.movingPlatform.setImmovable(true);
    this.movingPlatform.setVelocityX(100);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    this.platforms.create(750, 350, 'platform');
    this.platforms.create(400, 150, 'platform');
    this.platforms.create(400, 450, 'platform');
    this.platforms.create(50, 350, 'platform');
    this.platforms.create(0, 350, 'platform');
  }

  createRoshan() {
    this.roshan = this.physics.add.sprite(300, 450, 'roshan');
    this.roshan.setCollideWorldBounds(true);
    this.roshan.setBounce(0.2);
    this.physics.add.collider(this.roshan, this.platforms);
    this.physics.add.collider(this.roshan, this.movingPlatform);

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
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // coin generation
  createCoins() {
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: randomInt(10, 15),
      setXY: {
        x: randomInt(0, 200),
        y: 0,
        stepX: randomInt(50, 100),
      },
    });

    this.coins.children.iterate((child) => {
      child.setBounceY(0); child.setCollideWorldBounds(true);
    });

    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.collider(this.coins, this.movingPlatform);
    this.physics.add.overlap(this.roshan, this.coins, this.collectCoins, null, this);
  }


  collectCoins(roshan, coin) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.coins.countActive(true) === 0) {
      this.coins.children.iterate((child) => {
        child.enableBody(true, randomInt(0, 800), 0, true, true);
      });
    }
  }

  // ===============================================================================================
  // Update
  update() {
    if (this.cursors.left.isDown) {
      this.roshan.setVelocityX(-160);

      this.roshan.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.roshan.setVelocityX(160);

      this.roshan.anims.play('right', true);
    } else {
      this.roshan.setVelocityX(0);

      this.roshan.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.roshan.body.touching.down) {
      this.roshan.setVelocityY(-330);
    }

    if (this.movingPlatform.x >= 500) {
      this.movingPlatform.setVelocityX(-50);
    } else if (this.movingPlatform.x <= 300) {
      this.movingPlatform.setVelocityX(50);
    }
  }
}