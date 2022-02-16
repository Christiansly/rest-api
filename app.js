const express = require("express");
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const mongoose = require("mongoose");
const app = express()
app.use(bodyParser.json()); 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes)
mongoose.connect("mongodb+srv://admin:admin@cluster0.qfbbp.mongodb.net/feed?retryWrites=true&w=majority").then(() => console.log("Connected")).catch((err) => console.log(err))
app.listen(8080)