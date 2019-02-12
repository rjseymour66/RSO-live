const mongoose = require('mongoose')
const { CustomerSchema } = require('../models/customerModel');
const { OrderSchema } = require('../models/orderModel');

const Customer = mongoose.model('Customer', CustomerSchema);
const Order = mongoose.model('Order', OrderSchema);


// router.get('/api/v1/customers/:customer_id', loginRequired, updateCustomer) // get Customer info PRIVATE

const getCustomerInfo = (req, res) => {
  const customerId = req.params.customer_id

  Customer.findById(customerId)
    .exec((err, customer) => {
      if (customerId !== req.user._id) {
        res.status(400).json({ 
          error: 'Request failed. Check customer id'
        })
      } else {
        res.json(customer)
      }
    })
}




// router.put('/api/v1/customers/:customer_id') // update customer info PRIVATE

const updateCustomerById = (req, res) => {
    const customerParam = req.params.customer_id
    const customer_id = { _id: req.params.customer_id }
    const updatedInfo = req.body;
    const customerId = req.user._id

    Customer.findOneAndUpdate(customer_id, updatedInfo, { new: true }, (err, customer) =>{
      if(customerId !== customerParam) {
        res.status(404).json({ 
          ERROR: "Insufficient privileges" 
        })
      } else {
      res.json(customer)
      }
    })
}


// router.get('/api/v1/customers/:customer_id/orders') // get orders by customer PRIVATE - _createdBy === :customer_id

const getAllCustomerOrders = (req, res) => {
  const customerId = req.params.customer_id

  const limit = parseInt(req.query.limit)
  const sort = { created_date: req.query.sort }
  const offset = parseInt(req.query.offset)

  Order.find({ _createdBy : customerId })
  .limit(limit)
  .sort(sort)
  .skip(offset)
  .exec((err, orders) => {
    if(err) {
      res.status(404).json({ message: "Insufficient privileges." })
      } else {
        res.json(orders)
      }
  })
}






// router.delete('/api/v1/customers/:customer_id/orders/:order_id) // delete order for customer

const cancelOrder = (req, res) => {
  const orderId = { _id: req.params.order_id }
  Order.remove(orderId, (err, data) => {
    if(err) {
      res.status(404).json({ 
        ERROR: "Order not found" 
      })
    } else {
      res.json({ 
        SUCCESS: 'Order deleted' 
      })
    }
  })
};

module.export = {
  getCustomerInfo,
  updateCustomerById,
  getAllCustomerOrders,
  cancelOrder
}