/* eslint-disable no-undef */
import 'phaser';

export default {
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  width: 800,
  height: 600,
  pixelArt: true,
  type: Phaser.AUTO,
  parent: 'phaser-game',
  title: 'sinking dungeon',
  backgroundColor: 0x000000,
  dom: { createContainer: true },
};
