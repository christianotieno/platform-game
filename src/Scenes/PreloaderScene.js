import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      // eslint-disable-next-line radix
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.image('box', '../src/assets/ui/grey_box.png');
    this.load.audio('bgMusic', ['../src/assets/audio/TownTheme.mp3']);
    this.load.image('platform', '../src/assets/images/platform.png');
    this.load.image('blueButton1', '../src/assets/ui/blue_button02.png');
    this.load.image('blueButton2', '../src/assets/ui/blue_button03.png');
    this.load.image('checkedBox', '../src/assets/ui/blue_boxCheckmark.png');
    this.load.image('background', './src/assets/images/background.jpg');

    // spritesheets
    this.load.spritesheet('roshan', './src/assets/images/roshan.png', {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet('platform', './src/assets/images/platform.png', {
      frameWidth: 400,
      frameHeight: 32,
    });

    this.load.spritesheet('coin', './src/assets/images/coin.png', {
      frameWidth: 20,
      frameHeight: 20,
    });

    this.load.spritesheet('fire', './src/assets/images/fire.png', {
      frameWidth: 40,
      frameHeight: 32,
    });

    this.load.spritesheet('bomb', '../src/assets/images/bomb.png', {
      frameWidth: 40,
      frameHeight: 70,
    });

    this.load.spritesheet('star', '../src/assets/images/star.png', {
      frameWidth: 24,
      frameHeight: 22,
    });
  }

  ready() {
    this.readyCount += 1;
    if (this.readyCount === 1) {
      // Load Title Scene
      this.scene.start('Title');
    }
  }
}
