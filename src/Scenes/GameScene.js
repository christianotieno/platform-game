import 'phaser';
import OptionsScenes from './OptionsScene';

let game;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.mountainGroup = this.add.group();
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

    // group with all active coins.
    this.coinGroup = this.add.group({
      removeCallback(coin) {
        coin.scene.coinPool.add(coin);
      },
    });

    // coin pool
    this.coinPool = this.add.group({
      removeCallback(coin) {
        coin.scene.coinGroup.add(coin);
      },
    });

    // group with all active firecamps.
    this.fireGroup = this.add.group({
      removeCallback(fire) {
        fire.scene.firePool.add(fire);
      },
    });

    // fire pool
    this.firePool = this.add.group({
      removeCallback(fire) {
        fire.scene.fireGroup.add(fire);
      },
    });

    // adding a mountain
    this.addMountains();
    this.addedPlatforms = 0;
    this.playerJumps = 0;
    this.addPlatform(
      game.config.width, game.config.width / 2,
      game.config.height * OptionsScenes.platformVerticalLimit[1],
    );

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
    this.physics.add.overlap(this.player, this.coinGroup, function (player, coin) {
      this.tweens.add({
        targets: coin,
        y: coin.y - 100,
        alpha: 0,
        duration: 800,
        ease: 'Cubic.easeOut',
        callbackScope: this,
        onComplete() {
          this.coinGroup.killAndHide(coin);
          this.coinGroup.remove(coin);
        },
      });
    }, null, this);
    this.physics.add.overlap(this.player, this.fireGroup, function (player, fire) {
      this.dying = true;
      this.player.anims.stop();
      this.player.setFrame(2);
      this.player.body.setVelocityY(-200);
      this.physics.world.removeCollider(this.platformCollider);
    }, null, this);

    // checking for input
    this.input.on('pointerdown', this.jump, this);
  }

  // adding mountains
  addMountains() {
    const rightmostMountain = this.getRightmostMountain();
    if (rightmostMountain < game.config.width * 2) {
      const mountain = this.physics.add.sprite(
        rightmostMountain + Phaser.Math.Between(100, 350),
        game.config.height + Phaser.Math.Between(0, 100), 'mountain',
      );
      mountain.setOrigin(0.5, 1);
      mountain.body.setVelocityX(OptionsScenes.mountainSpeed * -1);
      this.mountainGroup.add(mountain);
      if (Phaser.Math.Between(0, 1)) {
        mountain.setDepth(1);
      }
      mountain.setFrame(Phaser.Math.Between(0, 3));
      this.addMountains();
    }
  }

  // get rightmost mountain
  getRightmostMountain() {
    let rightmostMountain = -200;
    this.mountainGroup.getChildren().forEach((mountain) => {
      rightmostMountain = Math.max(rightmostMountain, mountain.x);
    });
    return rightmostMountain;
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
      if (Phaser.Math.Between(1, 100) <= OptionsScenes.coinPercent) {
        if (this.coinPool.getLength()) {
          const coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
        } else {
          const coin = this.physics.add.sprite(posX, posY - 96, 'coin');
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play('rotate');
          coin.setDepth(2);
          this.coinGroup.add(coin);
        }
      }
      if (Phaser.Math.Between(1, 100) <= OptionsScenes.firePercent) {
        if (this.firePool.getLength()) {
          const fire = this.firePool.getFirst();
          fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          fire.y = posY - 46;
          fire.alpha = 1;
          fire.active = true;
          fire.visible = true;
          this.firePool.remove(fire);
        } else {
          const fire = this.physics.add.sprite(
            posX - platformWidth / 2
            + Phaser.Math.Between(
              1, platformWidth,
            ),
            posY - 46, 'fire',
          );

          fire.setImmovable(true);
          fire.setVelocityX(platform.body.velocity.x);
          fire.setSize(8, 2, true);
          fire.anims.play('burn');
          fire.setDepth(2);
          this.fireGroup.add(fire);
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

    // recycling coins
    this.coinGroup.getChildren().forEach(function (coin) {
      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);

    // recycling fire
    this.fireGroup.getChildren().forEach(function (fire) {
      if (fire.x < -fire.displayWidth / 2) {
        this.fireGroup.killAndHide(fire);
        this.fireGroup.remove(fire);
      }
    }, this);

    // recycling mountains
    this.mountainGroup.getChildren().forEach(function (mountain) {
      if (mountain.x < -mountain.displayWidth) {
        const rightmostMountain = this.getRightmostMountain();
        mountain.x = rightmostMountain + Phaser.Math.Between(100, 350);
        mountain.y = game.config.height + Phaser.Math.Between(0, 100);
        mountain.setFrame(Phaser.Math.Between(0, 3));
        if (Phaser.Math.Between(0, 1)) {
          mountain.setDepth(1);
        }
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
        nextPlatformGap, minPlatformHeight, maxPlatformHeight,
      );
      this.addPlatform(
        nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight,
      );
    }
  }
}