const Web3 = require('web3');

exports.useWeb3 = () =>{
  const testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545';

  let instance = new Web3(testnet);
  return instance;
}