const express = require('express');
const router = express.Router();

// RECORD CONTROLLER
const {
  createRecord,
  getAllRecords,
  updateRecordById,
} = require('../controllers/recordController');

// ORDER CONTROLLER
const {
  createOrder,
  updateOrderById,
  getAllCustomerOrders,
  cancelOrder
} = require('../controllers/orderController'); 

// MERCHANT CONTROLLER
const {
  getAllMerchantRecords,
  getAllMerchantOrders,
  getMerchant,
  updateMerchantById,
  deleteRecord
} = require('../controllers/merchantController');

// CUSTOMER CONTROLLER
const {
  getCustomerInfo,
  updateCustomerById
} = require('../controllers/customerController');

// MIDDLEWARE
const { 
  login,
  registerCustomer,
  registerMerchant,
  loginRequired,
  loginMerchant,
  verifyMerchant,
  createdBy,
  verifyThisCustomer
} = require('../middleware/authenticate')




// AUTHORIZATION ROUTES / CUSTOMER ROUTES
router.post('/auth/register/customer', registerCustomer) // YES
router.post('/auth/login/customer', login) // YES


// AUTHORIZATION ROUTES / MERCHANT
router.post('/auth/register/merchant', registerMerchant) // YES
router.post('/auth/login/merchant', loginMerchant) // YES


// RECORD ROUTES
router.post('/api/v1/records',  verifyMerchant, loginRequired, createRecord); // YES
router.get('/api/v1/records', loginRequired, getAllRecords); // YES 
router.get('/api/v1/records/merchants/:merchant_id', loginRequired, getAllMerchantRecords) // YES
router.put('/api/v1/records/:record_id', loginRequired, updateRecordById) // YES
router.delete('/api/v1/records/:record_id/merchants/:merchant_id', loginRequired, createdBy, deleteRecord) // YES


// ORDER ROUTES
router.post('/api/v1/orders/merchants/:merchant_id/records/:record_id', loginRequired, createOrder)// YES
// router.get('/api/v1/orders/:order_id', loginRequired, getOrder) // Security risk w/Paypay email
router.get('/api/v1/orders/merchants/:merchant_id', loginRequired, createdBy, getAllMerchantOrders) // YES
router.get('/api/v1/orders/customers/:customer_id', loginRequired, verifyThisCustomer, getAllCustomerOrders) // YES
router.put('/api/v1/orders/:order_id', loginRequired, updateOrderById) // YES
router.delete('/api/v1/orders/:order_id/customers/:customer_id', loginRequired, verifyThisCustomer, cancelOrder) // YES


// MERCHANT ROUTES
router.get('/api/v1/merchants/:merchant_id', loginRequired, getMerchant) // YES
router.put('/api/v1/merchants/:merchant_id', loginRequired, updateMerchantById) // YES

// CUSTOMER ROUTES
router.get('/api/v1/customers/:customer_id', loginRequired, verifyThisCustomer, getCustomerInfo) // YES
router.put('/api/v1/customers/:customer_id', loginRequired, updateCustomerById) // YES



// ABOVE ROUTES ARE TESTED AND COMPLETED #####################################################################################


// VIEW ROUTES
router.get('/', (req, res) => {
  res.render('home')
});


module.exports = router;