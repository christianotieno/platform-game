/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

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
  backgroundColor: 0x003366,
  dom: { createContainer: true },
  title: 'Roshan, the treasure hunter.',
};
