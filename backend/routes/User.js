const express = require('express');
const { SignUp, Login, userData, SearchUser, AllUsers } = require('../controllers/userController');


const router = express.Router();

router.post("/signup", SignUp);

router.post("/login", Login);

router.post("/userdata", userData);

router.post("/search", SearchUser);

router.post("/Alluser", AllUsers);

// router.post("/update/name", )

module.exports = router;