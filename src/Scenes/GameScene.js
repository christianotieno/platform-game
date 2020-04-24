/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */

import Phaser from 'phaser';
import OptionsScenes from './OptionsScene';

let game;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    // setting player animation
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers(
        'player', { start: 0, end: 1 },
      ),
      frameRate: 8,
      repeat: -1,
    });

    // setting star animation
    this.anims.create({
      key: 'rotate',
      frames: this.anims.generateFrameNumbers(
        'star', { start: 0, end: 5 },
      ),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });

    // setting bomb animation
    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers(
        'bomb', { start: 0, end: 4 },
      ),
      frameRate: 15,
      repeat: -1,
    });
    this.backgroundGroup = this.add.group();
    this.platformGroup = this.add.group({
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // platform pool
    this.platformPool = this.add.group({
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    // group with all active stars.
    this.starGroup = this.add.group({
      removeCallback(star) {
        star.scene.starPool.add(star);
      },
    });

    // star pool
    this.starPool = this.add.group({
      removeCallback(star) {
        star.scene.starGroup.add(star);
      },
    });

    // group with all active bombs.
    this.bombGroup = this.add.group({
      removeCallback(bomb) {
        bomb.scene.bombPool.add(bomb);
      },
    });

    // bomb pool
    this.bombPool = this.add.group({
      removeCallback(bomb) {
        bomb.scene.bombGroup.add(bomb);
      },
    });

    // adding the player;
    this.player = this.physics.add.sprite(
      OptionsScenes.playerStartPosition, game.config.height * 0.7, 'player',
    );
    this.player.setGravityY(OptionsScenes.playerGravity);
    this.player.setDepth(2);

    this.dying = false;
    this.platformCollider = this.physics.add.collider(
      this.player, this.platformGroup, function () {
        if (!this.player.anims.isPlaying) {
          this.player.anims.play('run');
        }
      }, null, this,
    );
    this.physics.add.overlap(
      this.player, this.starGroup, function (player, star) {
        this.tweens.add({
          targets: star,
          y: star.y - 100,
          alpha: 0,
          duration: 800,
          ease: 'Cubic.easeOut',
          callbackScope: this,
          onComplete() {
            this.starGroup.killAndHide(star);
            this.starGroup.remove(star);
          },
        });
      }, null, this,
    );
    this.physics.add.overlap(
      this.player, this.bombGroup, function (player, bomb) {
        this.dying = true;
        this.player.anims.stop();
        this.player.setFrame(2);
        this.player.body.setVelocityY(-200);
        this.physics.world.removeCollider(this.platformCollider);
      }, null, this,
    );

    // checking for input
    this.input.on('pointerdown', this.jump, this);
  }

  // add platform
  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms = +1;
    let platform;

    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      const newRatio = platformWidth / platform.displayWidth;
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    } else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform');
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(
        OptionsScenes.platformSpeedRange[0],
        OptionsScenes.platformSpeedRange[1],
      ) * -1);
      platform.setDepth(2);
      this.platformGroup.add(platform);
    }

    this.nextPlatformDistance = Phaser.Math.Between(
      OptionsScenes.spawnRange[0], OptionsScenes.spawnRange[1],
    );

    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= OptionsScenes.starPercent) {
        if (this.starPool.getLength()) {
          const star = this.starPool.getFirst();
          star.x = posX;
          star.y = posY - 96;
          star.alpha = 1;
          star.active = true;
          star.visible = true;
          this.starPool.remove(star);
        } else {
          const star = this.physics.add.sprite(posX, posY - 96, 'star');
          star.setImmovable(true);
          star.setVelocityX(platform.body.velocity.x);
          star.anims.play('rotate');
          star.setDepth(2);
          this.starGroup.add(star);
        }
      }
      if (Phaser.Math.Between(1, 100) <= OptionsScenes.bombPercent) {
        if (this.bombPool.getLength()) {
          const bomb = this.bombPool.getFirst();
          bomb.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          bomb.y = posY - 46;
          bomb.alpha = 1;
          bomb.active = true;
          bomb.visible = true;
          this.bombPool.remove(bomb);
        } else {
          const bomb = this.physics.add.sprite(
            posX - platformWidth / 2
            + Phaser.Math.Between(
              1, platformWidth,
            ),
            posY - 46, 'bomb',
          );

          bomb.setImmovable(true);
          bomb.setVelocityX(platform.body.velocity.x);
          bomb.setSize(8, 2, true);
          bomb.anims.play('burn');
          bomb.setDepth(2);
          this.bombGroup.add(bomb);
        }
      }
    }
  }

  // jump function
  jump() {
    if ((!this.dying)
    && (this.player.body.touching.down || (this.playerJumps > 0
      && this.playerJumps < OptionsScenes.jumps))) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(OptionsScenes.jumpForce * -1);
      this.playerJumps = +1;

      // stops animation
      this.player.anims.stop();
    }
  }

  // update progess
  update() {
    // game over
    if (this.player.y > game.config.height) {
      this.scene.start('PlayGame');
    }

    this.player.x = OptionsScenes.playerStartPosition;

    // recycling platforms
    let minDistance = game.config.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      const platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // recycling stars
    this.starGroup.getChildren().forEach(function (star) {
      if (star.x < -star.displayWidth / 2) {
        this.starGroup.killAndHide(star);
        this.starGroup.remove(star);
      }
    }, this);

    // recycling bomb
    this.bombGroup.getChildren().forEach(function (bomb) {
      if (bomb.x < -bomb.displayWidth / 2) {
        this.bombGroup.killAndHide(bomb);
        this.bombGroup.remove(bomb);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(
        OptionsScenes.platformSizeRange[0], OptionsScenes.platformSizeRange[1],
      );
      const platformRandomHeight = OptionsScenes.platformHeighScale
      * Phaser.Math.Between(
        OptionsScenes.platformHeightRange[0], OptionsScenes.platformHeightRange[1],
      );
      const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      const minPlatformHeight = game.config.height * OptionsScenes.platformVerticalLimit[0];
      const maxPlatformHeight = game.config.height * OptionsScenes.platformVerticalLimit[1];
      const nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight,
      );
      this.addPlatform(
        nextPlatformWidth,
        game.config.width
        + nextPlatformWidth / 2,
        nextPlatformHeight,
      );
    }
  }
}