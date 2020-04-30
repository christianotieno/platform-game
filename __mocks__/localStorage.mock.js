const localCoinStoreTest = (coin) => {
  const answer = JSON.stringify(coin);
  localStorage.setItem('coins', answer);
};

const getCurrentCoinsTest = () => {
  const answer = localStorage.getItem('coins');
  let result = JSON.parse(answer);
  if (result === null) {
    result = 0;
    localCoinStoreTest(result);
  }
  return result;
};

const storeCoinsTest = (coin) => {
  localCoinStoreTest(coin);
};

module.exports = {
  localCoinStoreTest, getCurrentCoinsTest, storeCoinsTest,
};
