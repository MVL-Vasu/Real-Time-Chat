const upload = require('../utils/Upload');
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

const uploadFile = async (req, res) => {

     try {

          let userid = jwt.decode(req.body.token);
          
          const result = await upload(req.file)
          await Users.findByIdAndUpdate(userid.user.id, { avatar: result?.secure_url });

          res.status(200).json({ success: true, image: result?.secure_url });

     } catch (error) {

          console.log(error);
          res.status(400).json({ success: false, error: error, message : "!Network Connection Error" });

     }
};

module.exports = uploadFile;