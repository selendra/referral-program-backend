const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/errorResponse');

const { Airdrop } = require('../model/airdrop');
const { Referral } = require('../model/referral');

exports.createAirdrop = asyncHandler(async(req, res, next) => {
  let airdrop;

  // Check for duplicated wallet and phone
  const wallet = await Airdrop.findOne({ wallet: req.body.wallet });
  const phone = await Airdrop.findOne({ phone: req.body.phone });
  if(wallet) return next(new ErrorResponse(`This wallet address already used!`, 400));
  if(phone) return next(new ErrorResponse(`This phone number already used!`, 400));
  
  // Check for referral
  if(req.body.referrer > "") {
    const referrer = await Referral.findOne({ referral_id: req.body.referrer }).populate({
      path: "referral"
    });
    if(!referrer) return next(new ErrorResponse(`Referral not valid!`, 400));
    if(referrer.numberOfUse > 4) return next(new ErrorResponse(`Referral is already used!`, 400));

    await Referral.findByIdAndUpdate(referrer._id, {
      numberOfUse: referrer.numberOfUse + 1
    }, {
      new: true,
      runValidators: true
    })
    airdrop = await Airdrop.create({
      wallet: req.body.wallet,
      email: req.body.email,
      phone: req.body.phone,
      social_link: req.body.social_link,
      session: req.body.session,
      referrer_id: referrer._id
    })
  } else {
    airdrop = await Airdrop.create(req.body);
  }

  res.status(200).json({
    data: airdrop
  })
})

exports.getUserReferred = asyncHandler(async(req, res, next) => {
  const userReferred = await Airdrop.find({ referrer_id: req.params.id })

  res.status(200).json({
    data: userReferred
  })
})