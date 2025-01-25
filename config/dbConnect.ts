const mongoose = require('mongoose');
require('dotenv').config();

const mongodbURL = process.env.MONGODB_URL;
mongoose.connect(mongodbURL)
  .then(() => {
    console.log(`Connected to MongoDB ${mongodbURL}`);
  })
  .catch((error:any) => {
    console.error('Error connecting to MongoDB:', error);
  });