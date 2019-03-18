const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const OrderSchema = new Order({
  records: [
    {
      record: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  customer: {
    email: {
      type: String,
      required: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Customer'
    }
  },
  merchant: {
    email: {
      type: String,
      required: true
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Merchant'
    }
  },
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
})

module.exports = mongoose.model('Order', OrderSchema);