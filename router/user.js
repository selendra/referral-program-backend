const express = require('express');
const { createUser, loginUser, getUser, facebookLogin, googleLogin, updateUser } = require('../controller/user');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/register')
  .post(createUser)

router
  .route('/login')
  .post(loginUser)
  
router  
  .route('/googlelogin')
  .post(googleLogin)

router  
  .route('/facebooklogin')
  .post(facebookLogin)
  
router
  .route('/profile')
  .get(protect, getUser)

router
  .route('/updateprofile')
  .put(protect, updateUser)

module.exports = router;