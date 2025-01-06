// require('dotenv').config();

const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const { app, server } = require("./socket/index");
const mongoURI = "mongodb://127.0.0.1:27017/chatapp";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("./models/Users");

// const app = express();
app.use(cors({
     origin: 'https://real-time-chat-frontend-lime.vercel.app'
}));

app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


//IMPORT THE MONGODB CONNECTION FILE FROM UTILS FOLDER
// const GetConnection = require("./utils/GetConnection");

// call the connect function
// GetConnection();

mongoose.connect(mongoURI, {
     useNewUrlParser: true,
     useUnifiedTopology: true
})
     .then(() => {
          console.log('Connected to MongoDB successfully!');
     }).catch((error) => {
          console.error('Error connecting to MongoDB:', error);
     });


// ===================================> IMAGE UPLOAD APIS <=================================== //

const imageRoutes = require('./routes/image');
app.use('/image', imageRoutes);


app.use("/mydata", (req, res) => {
     res.json("Server is Working");
})

app.post("/signup", async (req, res) => {

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

          res.status(400).json({ success: false, error: error });

     }

});

// ===================================> USER AUTHENTICATION APIS <=================================== //

// const userRoute = require('./routes/User');
// app.use("/user/", userRoute);

server.listen( 3001, () => {

     console.log(`server is running on port 3001`);

});

