const mongoose = require('mongoose')
const { OrderSchema } = require('../models/orderModel');

// require model
const Order = mongoose.model('Order', OrderSchema);


// CREATE / POST NEW ORDER
const createOrder = (req, res) => {

  let order = new Order({
    record_id: req.params.record_id,
    merchant_id: req.params.merchant_id,
    customer_info: [{
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    }],
    shipping_info: [{
      shipping_address1: req.body.shipping_address1,
      shipping_address2: req.body.shipping_address2,
      shipping_city: req.body.shipping_city,
      shipping_state: req.body.shipping_state,
      shipping_zip: req.body.shipping_zip
    }],
    billing_info: [{
      paypal_email: req.body.paypal_email,
      billing_address1: req.body.billing_address1,
      billing_address2: req.body.billing_address2,
      billing_city: req.body.billing_city,
      billing_state: req.body.billing_state,
      billing_zip: req.body.billing_zip
    }],
    comments: req.body.comments,
    _createdBy: req.user._id
  })
  order.save((err, order) => {
    if (err) {
      return res.status(400).send({ 
        error_message: "Order not created",
        response_code: 400
      });
    } else {
      return res.json(order);
    }
  });
};

// router.get('/api/v1/customers/:customer_id/orders') // get orders by customer PRIVATE - _createdBy === :customer_id

const getAllCustomerOrders = (req, res) => {
  const customerId = req.params.customer_id

  const limit = parseInt(req.query.limit)
  const sort = { created_date: req.query.sort }
  const offset = parseInt(req.query.offset)
  
  Order.find({_createdBy : customerId} )
  .limit(limit)
  .sort(sort)
  .skip(offset)
  .exec((err, orders) => {
    if(err) {
      res.status(404).json({ 
        error_message: "Insufficient privileges",
        response_code: 404
       })
      } else {
        res.json(orders)
      }
  })
}

// RETRIEVE / GET ONE ORDER
const getOrder = (req, res) => {
  const id = req.params.order_id

  Order.findById(id)
  .exec((err, order) => {
    if(err) {
      res.status(400).json({ 
        error_message: "Order not found",
        response_code: 404 
      })
    } else {
      res.json(order)
    }
  })
};


// RETRIEVE / GET ALL ORDERS
const getAllOrders = (req, res) => {
  const limit = parseInt(req.query.limit)
  const offset = parseInt(req.query.offset)
  const lastName = req.query.lastName
  const sort = { lastName : req.query.lastname }

    if(lastName) {
      Order.find({ customer_lastName : lastName })
      .limit(limit)
      .sort(sort)
      .skip(offset)
      .exec((err, data) => {
        if (err) {
          res.status(400).json({ 
            error_message: "Request failed",
            response_code: 400
          })
        } else {
          res.json(data)
        }
      });

    } else {
      Order.find()
      .limit(limit)
      .sort(sort)
      .skip(offset)
      .exec((err, data) => {
        if (err) {
          res.status(400).json({ 
            error_message: "Request failed",
            response_code: 400
          })
        } else {
          res.json(data)
        }
      });

    }
  }

  // Update an order
  const updateOrderById = (req, res) => {
    const id = { _id: req.params.order_id }
    const updatedInfo = req.body;
    const merchantId = req.user._id
    Order.findOneAndUpdate(id, updatedInfo, { new: true }, (err, order) => {
      if (merchantId !== order.merchant_id) {
        res.status(404).json({ 
          error_message: "Order not found. Check order id",
          response_code: 404
      })
      } else {
        res.json(order)
      }
    });
  };

// delete an order

const deleteOrder = (req, res) => {
  Order.remove({ _id: req.params.order_id }, (err, order) => {
    if (err) {
      res.status(404).json({ 
        error_message: "Order not found. Check order id",
        response_code: 404
      })
    } else {
      res.json({
        success_message: 'Order cancelled',
        response_code: 200
      })
    }
  });
};

// router.delete('/api/v1/customers/:customer_id/orders/:order_id) // delete order for customer

const cancelOrder = (req, res) => {
  const orderId = { _id: req.params.order_id }
  Order.remove(orderId, (err, data) => {
    if(err) {
      res.status(404).json({ 
        error_message: "Order not found",
        response_code: 404
      })
    } else {
      res.json({ 
        success_message: 'Order deleted',
        response_code: 200
      })
    }
  })
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderById,
  deleteOrder,
  getAllCustomerOrders,
  cancelOrder
}