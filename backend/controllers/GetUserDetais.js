const Users = require("../models/Users");
const jwt = require("jsonwebtoken");


const GetUserDetails = async (token) => {

     const decodetoken = jwt.decode(token);

     const user = await Users.findById(decodetoken.user.id).select("-password");

     return user;

}

module.exports = GetUserDetails ;