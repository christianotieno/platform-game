import 'phaser';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('platform', 'platform.png');
    this.load.spritesheet('player', 'player.png', {
      frameWidth: 24,
      frameHeight: 48,
    });
    this.load.spritesheet('coin', 'coin.png', {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.spritesheet('fire', 'fire.png', {
      frameWidth: 40,
      frameHeight: 70,
    });
    this.load.spritesheet('mountain', 'mountain.png', {
      frameWidth: 512,
      frameHeight: 512,
    });
  }

  create() {
    // setting player animation
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });
    // setting coin animation
    this.anims.create({
      key: 'rotate',
      frames: this.anims.generateFrameNumbers('coin', {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });
    // setting fire animation
    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers('fire', {
        start: 0,
        end: 4,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.scene.start('PlayGame');
  }
}

export default PreloaderScene;