const localCoinStore = (coin) => {
  const answer = JSON.stringify(coin);
  localStorage.setItem('coins', answer);
};

const getCurrentCoins = () => {
  const answer = localStorage.getItem('coins');
  let result = JSON.parse(answer);
  if (result === null) {
    result = 0;
    localCoinStore(result);
  }
  return result;
};

const storeCoins = (coin) => {
  localCoinStore(coin);
};

export {
  localCoinStore, getCurrentCoins, storeCoins,
};
