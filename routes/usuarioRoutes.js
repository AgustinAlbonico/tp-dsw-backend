const express = require('express');
const router = express.Router();
const {loginView,
    registerView,
    registerUser,
    loginUser,
    logout
    } = require('../controllers/loginController.js');

//get
router.get('/login', loginView);
router.get('/register', registerView);
router.get('/logout', logout);


//post
router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports= router;