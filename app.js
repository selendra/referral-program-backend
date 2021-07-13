const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require("./config/db");
const errorHandler = require('./middleware/error')

// route files
const user = require('./router/user');
const airdrop = require('./router/airdrop');
const referral = require('./router/referral');

// load env vars
dotenv.config({
  path: './config/config.env'
})

// connect to db
connectDB();

const app = express();

// cors handling
app.use(cors());
app.options('*', cors());

// body parser
app.use(express.json());

// dev loging middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// mount routers
app.use('/api/v1/user', user);
app.use('/api/v1/airdrop', airdrop);
app.use('/api/v1/referral', referral);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, 
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// handle unhandled rejection(like wrong password of mongoDB)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
})