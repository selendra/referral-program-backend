const express = require('express');
const { getReferral, createReferral } = require('../controller/referral');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getReferral)
  .post(protect, createReferral)

module.exports = router;