import 'phaser';

let game;

const config = {
  type: Phaser.AUTO,
  width: 1334,
  height: 750,
  backgroundColor: 0x0c88c7,
  physics: {
    default: 'arcade',
  },
};

const resize = () => {
  const canvas = document.querySelector('canvas');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = `${windowWidth}px`;
    canvas.style.height = `${windowWidth / gameRatio}px`;
  } else {
    canvas.style.width = `${windowHeight * gameRatio}px`;
    canvas.style.height = `${windowHeight}px`;
  }
};

export { config, resize };
