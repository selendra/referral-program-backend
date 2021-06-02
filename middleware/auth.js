const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../util/errorResponse');

const jwt = require('jsonwebtoken');

const { User } = require('../model/user');

// protect route
exports.protect = asyncHandler(async(req, res, next) => {
  let token;

  if(req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  // make sure token exist
  if(!token) {
    return next(new ErrorResponse('This user is not authorized', 401));
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    return next(new ErrorResponse('This user is not authorized!', 401));
  }
})