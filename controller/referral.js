const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/errorResponse');

const { v4: uuidv4 } = require("uuid");

const { Referral } = require('../model/referral');
const { useWeb3 } = require('../util/useWeb3');
const { useContract } = require('../util/useContract');

exports.getReferral = asyncHandler(async(req, res, next) => {
  const referral = await Referral.find({ userId: req.user.id });

  if(!referral) return next(new ErrorResponse('No Data', 400));

  res.status(200).json({
    data: referral
  })
})

exports.createReferral = asyncHandler(async(req, res, next) => {
  let web3 = useWeb3();
  let contract = useContract();

  const decrypt = await web3.eth.accounts.decrypt(
    JSON.parse(req.body.keystore), 
    req.body.password
  );

  const transaction = contract.methods.transfer(
    '0x1d95aD53E69Fe58efe777a7490EcF63A2CcbB1De',
    web3.utils.toHex(web3.utils.toWei('1', 'ether'))
  );
  const options = {
    to      : transaction._parent._address,
    data    : transaction.encodeABI(),
    gas     : await transaction.estimateGas({from: decrypt.address}),
    gasPrice: await web3.eth.getGasPrice()
  };
  const signed  = await web3.eth.accounts.signTransaction(options, decrypt.privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log('Receipt:', receipt);
  console.log('Hash:'+receipt.blockHash);

  if(receipt.status === true) {
    const referral = await Referral.create({
      referral_id: uuidv4(),
      userId: req.user.id,
      transactionHash: receipt.transactionHash
    })
  
    res.status(200).json({
      data: referral
    })
  } else {
    res.status(400).json({
      error: 'Transaction Failed!'
    })
  }
})

exports.createReferralByMetamask = asyncHandler(async(req, res, next) => {
  if(!req.body.txHash) return next(new ErrorResponse('Transaction Failed!', 400));

  function PendingTrx() { 
    const web3 = useWeb3();
    web3.eth.getTransactionReceipt(req.body.txHash, async function (error, result) { 
      if(result === null || error) {
        setTimeout(() => {
          PendingTrx();
        }, 2000);
      } else if(result !== null || !error) {
        if(result.status === true) {
          const referral = await Referral.create({
            referral_id: uuidv4(),
            userId: req.user.id,
            transactionHash: req.body.txHash
          })
        
          res.status(200).json({
            data: referral
          })
        } else {
          return next(new ErrorResponse('Transaction Failed!', 400));
        }
      }
    })
  }

  setTimeout(() => {
    PendingTrx();
  }, 2000);
})