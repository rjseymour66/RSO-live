// require('./config/config');
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const RateLimit = require('express-rate-limit');
const morgan = require('morgan')
const helmet = require('helmet')
const jsonwebtoken = require('jsonwebtoken');
const router = require('./routes/routes');
const cors = require('cors');


// express server
const app = express();


// CONNECT DB
// =================================================================

const PORT = process.env.PORT || 4000;
const URL = process.env.DATABASE_URL || 'mongodb://localhost/record-stack-overflow'

mongoose.connect(URL, () => {
  console.log(`The database is connected!`);
});

// MIDDLEWARE
// =================================================================

// add CORS
app.use(cors());

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  next();
});

// EJS
app.set('view engine', 'ejs');

// helmet setup
app.use(helmet());

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// JWT setup
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, (err, decode) => {
          if(err) req.user = undefined;
          req.user = decode;
          next();
      });
  } else {
      req.user = undefined;
      next();
  }
});

// rate limit setup
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  delayMs: 0
});

// morgan setup
app.use(morgan('tiny'))

// serve static files
app.use(express.static('public'));

// router
app.use('/', router)

// Server ===========================================

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});