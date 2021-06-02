const mongoose = require('mongoose');

const airdropSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  wallet: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  social_link: {
    type: [String],
  },
  session: {
    type: String
  },
  referrer_id: {
    type: String
  }
})

exports.Airdrop = mongoose.model('Airdrop', airdropSchema);
