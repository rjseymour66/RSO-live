const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;



const BillingSchema = new Schema({
  paypal_email: {
    type: String,
    required: 'Enter your PayPal account email'
  },
  billing_address1: {
    type: String,
    default: undefined
  },
  billing_address2: {
    type: String,
    default: undefined,
  },
  billing_city: {
    type: String,
    default: undefined,
  },
  billing_state: {
    type: String,
    default: undefined,
  },
  billing_zip: {
    type: String,
    default: undefined,
  },
  _id: false,
  id: false
})

const ShippingSchema = new Schema({
  shipping_address1: {
    type: String,
    required: 'Address 1 required'
  },
  shipping_address2: {
    type: String,
  },
  shipping_city: {
    type: String,
    required: 'City required'
  },
  shipping_state: {
    type: String,
    required: 'State required'
  },
  shipping_zip: {
    type: String,
    required: 'Zip code required'
  },
  _id: false,
  id: false
})

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

  shipping_info: [ShippingSchema],

  billing_info: [BillingSchema],
  
  created_date: {
    type: Date,
    default: Date.now
  }
});



CustomerSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword)
};



module.exports = mongoose.model('Billing', BillingSchema);
module.exports = mongoose.model('Shipping', ShippingSchema);
module.exports = mongoose.model('Customer', CustomerSchema);