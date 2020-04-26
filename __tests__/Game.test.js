/* eslint-disable no-undef */
import startGame from '../__mocks__/gameScene.mock';

describe('Successfully pass the game creation check', () => {
  test('creation of a new game object', () => {
    expect(typeof startGame()).toBe('object');
  });

  test('Successfully creates the provided game scene', () => {
    expect(typeof startGame().scene.scenes.length).toBe('number');
  });
});