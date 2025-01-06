const mongoose = require('mongoose');
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

const GetConnection = () => {

     mongoose.connect( mongoURI , {
          useNewUrlParser: true,
          useUnifiedTopology: true
     })
          .then(() => {
               console.log('Connected to MongoDB successfully!');
          }).catch((error) => {
               console.error('Error connecting to MongoDB:', error);
          });

}

module.exports = GetConnection;