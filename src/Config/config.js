/* eslint-disable no-undef */
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  dom: {
    createContainer: true,
  },
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 500,
      },
      debug: false,
    },
  },
};

export default config;