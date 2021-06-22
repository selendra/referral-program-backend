const abi = require('../contract/abi.json');

exports.useContract = () => {
  const contractAddress = '0xd84D89d5C9Df06755b5D591794241d3FD20669Ce';

  const web3 = useWeb3();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}