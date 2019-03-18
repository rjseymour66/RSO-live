const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  firstName: {
    type: String,
    required: 'First name required'
  },
  lastName: {
    type: String,
    required: 'Last name required'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  hashPassword: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    shipping_address1: { type: String, required: true },
    shipping_address2: { type: String },
    shipping_city: { type: String, required: true },
    shipping_state: { type: String, required: true },
    shipping_zip: { type: String, required: true }
  },

  created_date: {
    type: Date,
    default: Date.now
  }
});


CustomerSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
};


module.exports = mongoose.model('Customer', CustomerSchema);





