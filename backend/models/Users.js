const mongoose = require('mongoose');

const Users = mongoose.model('Users', {
     name : {
          type : String
     },
     username : {
          type : String,
     },
     email : {
          type : String,
          required : true,
          unique : true
     },
     password : {
          type : String,
     },
     lastseen : {
          type : Date,
     },
     bio : {
          type : String,
          default : "Hi, There i an using chat app",
     },
     avatar : {
          type : String,
     }
});

module.exports = Users;