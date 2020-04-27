/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');

    this.score = 0;
    this.gameOver = false;
    this.initialTime = 15;
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
    this.createBombs();

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    this.gameOverText = this.add.text(230, 260, 'Game Over', { fontSize: '64px', fill: '#000' });
    this.gameOverText.setOrigin(0, 0);
    this.gameOverText.visible = false;


    this.timerText = this.add.text(0, 100, `Countdown: ${this.initialTime}`, { fill: '#fff' });

    const onEvent = () => {
      do {
        this.initialTime -= 1;
        this.timerText.setText(`Countdown: ${this.initialTime}`);
      }
      while (this.initialTime < 0);
      if (this.initialTime === 0) {
        this.gameOver = true; this.gameOverText.visible = true;
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

  //
  createCoins() {
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 12,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.coins.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
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
        child.enableBody(true, child.x, 0, true, true);
      });
      const x = (roshan.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  createBombs() {
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(this.bombs, this.movingPlatforms);
    this.physics.add.collider(this.roshan, this.bombs, this.hitBomb, null, this);
  }

  hitBomb(roshan, bomb) {
    this.physics.pause();
    roshan.setTint(0xff0000);
    roshan.anims.play('turn');
    this.gameOver = true;
    this.gameOverText.visible = true;
    this.scene.start('GameOver');
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