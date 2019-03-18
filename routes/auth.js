const express = require('express');
const router = express.Router();

const authController = require('../middleware/authenticate')



// AUTHORIZATION ROUTES / CUSTOMER ROUTES
router.post('/auth/register/customer', authController.registerCustomer) // YES
router.post('/auth/login/customer', authController.login) // YES


// AUTHORIZATION ROUTES / MERCHANT
router.post('/auth/register/merchant', authController.registerMerchant) // YES
router.post('/auth/login/merchant', authController.loginMerchant) // YES


module.exports = router;