const mongoose = require('mongoose')
const { CustomerSchema } = require('../models/customerModel');

const Customer = mongoose.model('Customer', CustomerSchema);


// router.get('/api/v1/customers/:customer_id', loginRequired, updateCustomer) // get Customer info PRIVATE

const getCustomerInfo = (req, res) => {
  const customerId = req.params.customer_id

  Customer.findById(customerId)
  .exec((err, customer) => {
    if (err) {
      res.status(400).json({ 
      error_message: "Request failed. Check customer id",
      response_code: 400 })
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
          error_message: "Insufficient privileges",
          response_code: 400 
        })
      } else {
      res.json(customer)
      }
    })
}


module.exports = {
  getCustomerInfo,
  updateCustomerById
}