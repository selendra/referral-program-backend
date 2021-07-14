const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");
const fetch = require('node-fetch');

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../util/errorResponse');
const { createConnection } = require('../util/google-util');

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
  const email = await User.findOne({ email: req.body.email.toLowerCase() });
  const phone = await User.findOne({ phone: req.body.phone });
  const wallet = await User.findOne({ wallet: req.body.wallet.toLowerCase() });
  if(email) return next(new ErrorResponse('This email already register!!', 400));
  if(phone) return next(new ErrorResponse('This phone number already register!!', 400));
  if(wallet) return next(new ErrorResponse('This wallet address already register!!', 400));

  const user = await User.create({
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    phone: req.body.phone,
    wallet: req.body.wallet.toLowerCase()
  });

  const referral = await Referral.create({
    referral_id: uuidv4(),
    userId: user._id,
    transactionHash: 'Register Account'
  })

  res.status(200).json({
    data: user,
    referral: referral
  })
})

exports.loginUser =  asyncHandler(async(req, res, next) => {
  const secret = process.env.SECRET;
  const { password } = req.body;
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  if(!user) return next(new ErrorResponse(`User not found`, 404));
  if(user && bcryptjs.compareSync(password, user.password)) {
    const token = jwt.sign(
      { userId: user.id }, 
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

exports.googleLogin = asyncHandler(async(req, res, next) => {
  const { tokenId } = req.body;
  
  const auth = createConnection();
  const response = await auth.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID
  })
  const { email_verfied, email } = await response.payload;
  if({email_verfied}) {
    const user = await User.findOne({email: email.toLowerCase()});
    const secret = process.env.SECRET;
    if(user) {
      const token = jwt.sign(
        { userId: user.id },
        secret,
        { expiresIn: '1d' }
      )
      res.status(200).json({
        token: token
      })
    } else {
      const password = email + secret;
      const user = await User.create({
        email: email.toLowerCase(),
        password: password,
      });

      const referral = await Referral.create({
        referral_id: uuidv4(),
        userId: user._id,
        transactionHash: 'Register Account'
      })
      const token = jwt.sign(
        { userId: user.id }, 
        secret,
        { expiresIn: '1d' }
      )
      res.status(200).json({
        token: token
      })
    }
  }
})

exports.facebookLogin = asyncHandler(async(req, res, next) => {
  const {userID, accessToken} = req.body;

  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
  const response = await fetch(urlGraphFacebook, {
    method: 'GET'
  })
  const data = await response.json();
  const { email } = data;

  const user = await User.findOne({email: email.toLowerCase()});
  const secret = process.env.SECRET;
  if(user) {
    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: '1d' }
    )
    res.status(200).json({
      token: token
    })
  } else {
    const password = email + secret;
    const user = await User.create({
      email: email.toLowerCase(),
      password: password,
    });

    const referral = await Referral.create({
      referral_id: uuidv4(),
      userId: user._id,
      transactionHash: 'Register Account'
    })
    const token = jwt.sign(
      { userId: user.id }, 
      secret,
      { expiresIn: '1d' }
    )
    res.status(200).json({
      token: token
    })
  }
})

exports.updateUser = asyncHandler(async(req, res, next) => {
  const phone = await User.findOne({ phone: req.body.phone });
  const wallet = await User.findOne({ wallet: req.body.wallet.toLowerCase() });
  if(phone) return next(new ErrorResponse('This phone number already register!!', 400));
  if(wallet) return next(new ErrorResponse('This wallet address already register!!', 400));

  user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({ 
    success: true, 
    data: user 
  });
})