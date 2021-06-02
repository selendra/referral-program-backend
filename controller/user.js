const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/errorResponse');

const { User } = require('../model/user');
const { Referral } = require('../model/referral');

exports.getUser = asyncHandler(async(req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if(!user) return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));

  res.status(200).json({
    data: user
  })
})

exports.createUser = asyncHandler(async(req, res, next) => {
  const phone = await User.findOne({ phone: req.body.phone });
  const wallet = await User.findOne({ wallet: req.body.wallet });
  if(phone) return next(new ErrorResponse('This phone number already register!!', 400));
  if(wallet) return next(new ErrorResponse('This wallet address already register!!', 400));

  const user = await User.create(req.body);
  const referral = await Referral.create({
    referral_id: uuidv4(),
    userId: user._id,
  })

  res.status(200).json({
    data: user,
    referral: referral
  })
})

exports.loginUser =  asyncHandler(async(req, res, next) => {
  const secret = process.env.SECRET;
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if(!user) return next(new ErrorResponse(`User not found`, 404));
  if(user && bcryptjs.compareSync(password, user.password)) {
    const token = jwt.sign(
      { 
        userId: user.id,
      }, 
      secret,
      { expiresIn: '1d' }
    )
    res.status(200).json({
      token: token
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated!'
    })
  }
})