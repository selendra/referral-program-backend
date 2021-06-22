const express = require('express');
const { getReferral, createReferral, createReferralByMetamask } = require('../controller/referral');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getReferral)
  .post(protect, createReferral)


router
  .route('/metamask')
  .post(protect, createReferralByMetamask)

module.exports = router;