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



//init routing
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello world!",
        metadata: "Fan TipsJS".repeat(100000)
    })
})


//handle errors

module.exports = app;