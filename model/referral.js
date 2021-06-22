const mongoose = require('mongoose');

const referralSchema = mongoose.Schema({
  referral_id: {
    type: String,
    unique: true
  },
  numberOfUse: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  transactionHash: {
    type: String,
    required: true
  }
})

exports.Referral = mongoose.model('Referral', referralSchema);
