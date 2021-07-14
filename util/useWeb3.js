const Web3 = require('web3');

exports.useWeb3 = () =>{
  const testnet = 'https://bsc-dataseed.binance.org';

  let instance = new Web3(testnet);
  return instance;
}