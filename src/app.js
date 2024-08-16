const express = require('express');
const app = express();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');



//init middlewares
const MorganFormatConfig = require('../configs/morgan');
app.use(morgan(MorganFormatConfig.FORMAT.DEV))

app.use(helmet())
app.use(compression())

//init db
require('../dbs/init.mongodb');



//init routing
app.use('/', require('../routes/index'));


//handle errors

module.exports = app;