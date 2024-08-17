const express = require('express');
const app = express();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');



//init middlewares
const MorganFormatConfig = require('../configs/morgan');
app.use(morgan(MorganFormatConfig.FORMAT.DEV))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(helmet())
app.use(compression())

//init db
require('../dbs/init.mongodb');



//init routing
app.use('/', require('../routes/index'));


//handle errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error?.status ?? 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message ?? 'Internal Server Error'
    })
})


module.exports = app;