const express = require('express');
const { createUser, loginUser, getUser, userList } = require('../controller/user');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/register')
  .post(createUser)

router
  .route('/login')
  .post(loginUser)

router
  .route('/profile')
  .get(protect, getUser)

module.exports = router;