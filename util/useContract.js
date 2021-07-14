const abi = require('../contract/abi.json');

exports.useContract = () => {
  const contractAddress = '0x30bab6b88db781129c6a4e9b7926738e3314cf1c';

  const web3 = useWeb3();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}