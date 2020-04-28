/* eslint-disable no-undef */
const api = require('../__mocks__/api.mock');


describe('submit a score if input are valid', () => {
  test('submit score to the Api if the imput are valid', () => api.submitScore('john doe', 280).then((data) => {
    expect(data).toBe('Leaderboard score created correctly.');
  }));
});

describe('create a game with a valid name', () => {
  test('create a game to if the name is valid', () => api.createGame().then((data) => {
    expect(data).toBeTruthy();
  }));
});

describe('Retrieve the score', () => {
  test('return the score if the app exists', () => api.getScoreBoard().then((data) => {
    expect(typeof data).toBe('object');
  }));
});