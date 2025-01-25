"use strict";
const mongoose = require('mongoose');
require('dotenv').config();
const mongodbURL = process.env.MONGODB_URL;
mongoose.connect(mongodbURL)
    .then(() => {
    console.log(`Connected to MongoDB ${mongodbURL}`);
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
