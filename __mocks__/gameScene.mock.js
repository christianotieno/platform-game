/* eslint-disable no-undef */
import Phaser from 'phaser';
import GameScene from '../src/Scenes/GameScene';

function startGame() {
  const config = {
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 500 },
        debug: true,
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
    scene: [GameScene],
  };
  const game = new Phaser.Game(config);
  return game;
}

export default startGame;
