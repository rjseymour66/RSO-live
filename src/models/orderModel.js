const mongoose = require('mongoose')
const {ShippingSchema} = require('./customerModel');
const { BillingSchema } = require('./customerModel');

const Schema = mongoose.Schema;



const Customer2Schema = new Schema({
  _id: false,
  username: {
    type: String,
    required: 'Customer username required'
  },
  email: {
    type: String,
    required: 'Customer email required'
  },
  firstName: {
    type: String,
    required: 'Customer first name required'
  },
  lastName: {
    type: String,
    required: 'Customer last name required'
  }
})



const OrderSchema = new Schema ({
  status: {
    type: String,
    default: 'In progress'
  },
  record_id: {
    type: String,
    required: 'Please enter the record ID'
  },
  merchant_id: {
    type: String,
    required: 'Please enter the record ID'
  },
    
  customer_info: [Customer2Schema],

  shipping_info: [ShippingSchema],

  billing_info: [BillingSchema],

  created_date: {
    type: Date,
    default: Date.now
  },
  comments: {
    type: [String],
    default: undefined
  },
  _createdBy: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Order', OrderSchema);