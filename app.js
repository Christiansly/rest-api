const express = require("express");
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const mongoose = require("mongoose");
const  path  = require("path");
const app = express()
app.use(bodyParser.json()); 
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes)
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({message: message})
})
mongoose.connect("mongodb+srv://admin:admin@cluster0.qfbbp.mongodb.net/feed?retryWrites=true&w=majority").then(() => app.listen(8080)).catch((err) => console.log(err))
// app.listen(8090)