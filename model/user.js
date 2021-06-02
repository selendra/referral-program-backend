const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  wallet: {
    type: String,
    required: true
  }
})

// encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hashSync(this.password, salt);
})

exports.User = mongoose.model('User', userSchema);