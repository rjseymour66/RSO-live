const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator');
const { ShippingSchema } = require('./customerModel');



const Schema = mongoose.Schema;


const MerchantSchema = new Schema({
  merchantAccount: {
    type: Boolean,
    default: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  primaryContact: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
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
  phoneNumber: {
    type: String,
    required: true,
    minLength: 10,
    unique: true
  },
  hashPassword: {
    type: String,
    required: true,
    minLength: 6
  },
  address: [ShippingSchema],

  created_date: {
    type: Date,
    default: Date.now 
  }
})


MerchantSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
};


module.exports = mongoose.model('Merchant', MerchantSchema);