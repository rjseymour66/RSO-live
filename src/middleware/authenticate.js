const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { CustomerSchema } = require('../models/customerModel');
const { MerchantSchema } = require('../models/merchantModel')

const Customer = mongoose.model('Customer', CustomerSchema);
const Merchant = mongoose.model('Merchant', MerchantSchema)


// REGISTER NEW Customer

const registerCustomer = (req, res) => {
  const newCustomer = new Customer({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
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
    }]    
  });
  newCustomer.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newCustomer.save((err, customer) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      customer.hashPassword = undefined;
      return res.json(customer);
    }
  })
};



// LOGIN Customer GET TOKEN

const login = (req, res) => {
  Customer.findOne({ email: req.body.email }, (err, customer) => {
    if (err) throw err;
    if (!customer) {
      res.status(401).json({ ERROR: 'Authentication failed. No customer found.' });
    } else if (customer) {
      if (!customer.comparePassword(req.body.password, customer.hashPassword)) {
        res.status(401).json({ ERROR: 'Authentication failed. Wrong password.' });
      } else {
        return res.json({ 'secret token' : jwt.sign({ 
          email: customer.email, 
          username: customer.username, 
          _id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName }, process.env.JWT_SECRET) 
        });
      }
    }
  });
};


// REGISTER NEW MERCHANT

const registerMerchant = (req, res) => {
  const newMerchant = new Merchant({
    companyName: req.body.companyName,
    primaryContact: req.body.primaryContact,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    address: [{
      shipping_address1: req.body.shipping_address1,
      shipping_address2: req.body.shipping_address2,
      shipping_city: req.body.shipping_city,
      shipping_state: req.body.shipping_state,
      shipping_zip: req.body.shipping_zip
    }]
  });
  newMerchant.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newMerchant.save((err, merchant) => {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      newMerchant.hashPassword = undefined;
      return res.json(merchant);
    }
  })
};

// LOGIN MERCHANT GET TOKEN


const loginMerchant = (req, res) => {
  Merchant.findOne({
    email: req.body.email
  }, (err, merchant) => {
    if (err) throw err;
    if (!merchant) {
      res.status(401).json({ ERROR: 'Authentication failed. No merchant found.' });
    } else if (merchant) {
      if (!merchant.comparePassword(req.body.password, merchant.hashPassword)) {
        res.status(401).json({ ERROR: 'Authentication failed. Wrong password.' });
      } else {
        return res.json({ 'secret token' : jwt.sign({ merchantAccount: merchant.merchantAccount, companyName: merchant.companyName, primaryContact: merchant.primaryContact, email: merchant.email, _id: merchant.id }, process.env.JWT_SECRET) });
      }
    }
  });
};



// CUSTOMER LOGIN REQUIRED
const loginRequired = (req, res, next) => {
  if (req.user) {

    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized user' });
  }
};




// IS MERCHANT MIDDLEWARE


const verifyMerchant = (req, res, next) => {

  console.log('*********** merchantAccount', req.user.merchantAccount);
  if(!req.user.merchantAccount) {
    res.status(404).json({error : 'Insufficient privileges'})
  } else
    next();
}

// CREATED BY MIDDLEWARE - MERCHANT

const createdBy = (req, res, next) => {
  const merchId = req.params.merchant_id;
  const userId = req.user._id
  const recId = req.params.record_id;

  console.log('***************** MerchantID', merchId);
  console.log('*****************    User ID', userId);
  console.log('*****************  Record ID', recId);

  if(merchId !== userId){
    res.status(404).json({ error: "Insufficient privileges" })  
  } else {
      next();
  }
}

const verifyThisCustomer = (req, res, next) => {
  const userParam = req.params.customer_id
  const userId = req.user._id

  console.log('*****************    User ID', userId);
  console.log('*****************  Record ID', userParam);

  if(userParam !== userId){
    res.status(404).json({ ERROR: "Insufficient privileges" })  
  } else {
      next();
  }
}



module.exports = {
  registerCustomer,
  login,
  registerMerchant,
  loginMerchant,
  loginRequired,
  verifyMerchant,
  createdBy,
  verifyThisCustomer
}