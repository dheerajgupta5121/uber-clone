const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/authMiddleware');

const {register, login, userProfile, logout} = require('../Controller/userController');

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware.auth, userProfile);
router.get("/logout", authMiddleware.auth, logout); 

// export  

module.exports= router; 