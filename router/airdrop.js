const express = require('express');
const { createAirdrop, getUserReferred } = require('../controller/airdrop');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(createAirdrop)

router
  .route('/get/userReferred/:id')
  .get(protect, getUserReferred)

module.exports = router;