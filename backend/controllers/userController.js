
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const GetUserDetails = require("./GetUserDetais");

const SignUp = async (req, res) => {

     try {

          const { username, email, password } = req.body;

          const checkemail = await Users.findOne({ email: email });

          if (checkemail) {
               res.status(400).json({ success: false, error: "Email Already Exist" });
          }
          else {

               const hashpass = await bcrypt.hash(password, 10);

               const user = new Users({
                    name: username,
                    username: "",
                    avatar: "",
                    lastseen: Date.now(),
                    email: email,
                    password: hashpass,
               })

               user.save();

               const data = {
                    user: {
                         id: user.id,
                    }
               }

               const token = jwt.sign(data, "secret_chat")

               res.status(200).json({ success: true, message: "Sign Up Successfull", token });
          }

     } catch (error) {

          res.status(404).json({ success: false, error: error });

     }

}

const Login = async (req, res) => {

     try {

          const { email, password, token } = req.body;

          const user = await Users.findOne({ email: email });

          if (!user) {
               res.status(500).json({ success: false, message: "Email Not Found", token });
          }
          else {
               const passcompare = await bcrypt.compare(password, user.password);

               if (passcompare) {

                    let data = {
                         user: {
                              id: user.id,
                         }
                    }

                    const token = jwt.sign(data, "secret_chat");

                    res.status(200).json({ success: true, message: "login successfully", token: token });

               }
               else {

                    res.status(500).json({ success: false, message: "Password Not Matched" })

               }

          }

     } catch (error) {

          res.status(404).json({ success: false, error: error });

     }


};

const userData = async (req, res) => {

     try {

          const token = req.body.token;

          const user = await GetUserDetails(token);

          if (user) {

               res.status(200).json({ success: true, data: user });

          } else {

               return res.status(500).json({ success: false, error: "User Not Found" });

          }

     } catch (error) {

          console.error(error);
          return res.status(404).json({ success: false, error: error });

     }

}

const SearchUser = async (req, res) => {

     const { q } = req.query; // Get the query from request
     try {
          const users = await Users.find({
               $or: [
                    { name: { $regex: q, $options: 'i' } }, // Case-insensitive search by name
                    { email: { $regex: q, $options: 'i' } }, // Case-insensitive search by email
               ],
          }).limit(10); // Limit results to 10

          res.json(users);

     } catch (error) {

          res.status(500).json({ error: 'Server Error' });

     }
}

const AllUsers = async (req, res) => {

     try {

          const users = await Users.find({});
          res.status(200).json({ success: true, users: users });

     } catch (error) {

          res.status(500).json({ error: 'Server Error' });

     }

}


module.exports = { SignUp, Login, userData, SearchUser, AllUsers };