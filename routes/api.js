const express = require('express');
const router = express.Router();

const recordController = require('../controllers/records');

const orderController = require('../controllers/orders');

const merchantController = require('../controllers/merchants')

const customerController = require('../controllers/customers')

const middleware = require('../middleware/authenticate')


// RECORD ROUTES
router.post('/records', middleware.verifyMerchant, middleware.loginRequired, recordController.createRecord); // YES

router.get('/records', middleware.loginRequired, recordController.getAllRecords); // YES 

router.get('/records/merchants/:merchant_id', middleware.loginRequired, merchantController.getAllMerchantRecords) // YES

router.put('/records/:record_id', middleware.verifyMerchant, middleware.loginRequired, recordController.updateRecordById) // YES

router.delete('/records/:record_id/merchants/:merchant_id', middleware.loginRequired, middleware.createdBy, merchantController.deleteRecord) // YES


// ORDER ROUTES
router.post('/orders/merchants/:merchant_id/records/:record_id', middleware.loginRequired, orderController.createOrder)// YES

// router.get('/orders/:order_id', middleware.loginRequired, getOrder) // Security risk w/Paypay email
router.get('/orders/merchants/:merchant_id', middleware.loginRequired, middleware.createdBy, merchantController.getAllMerchantOrders) // YES

router.get('/orders/customers/:customer_id', middleware.loginRequired, middleware.verifyThisCustomer, orderController.getAllCustomerOrders) // YES

router.put('/orders/:order_id', middleware.loginRequired, orderController.updateOrderById) // YES

router.delete('/orders/:order_id/customers/:customer_id', middleware.loginRequired, middleware.verifyThisCustomer, orderController.cancelOrder) // YES


// MERCHANT ROUTES
router.get('/merchants/:merchant_id', middleware.loginRequired, merchantController.getMerchant) // YES

router.put('/merchants/:merchant_id', middleware.loginRequired, merchantController.updateMerchantById) // YES

// CUSTOMER ROUTES
router.get('/customers/:customer_id', middleware.loginRequired, middleware.verifyThisCustomer, customerController.getCustomerInfo) // YES

router.put('/customers/:customer_id', middleware.loginRequired, customerController.updateCustomerById) // YES



// ABOVE ROUTES ARE TESTED AND COMPLETED #####################################################################################


// VIEW ROUTES
router.get('/', (req, res) => {
  res.render('index')
});

router.get('/', (req, res, next) => {
  res.render('customer-login')
})


module.exports = router;