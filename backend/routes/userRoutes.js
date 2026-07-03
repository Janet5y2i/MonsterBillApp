// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth'); 

//console.log('檢查 register 函數是否存在:', userController.register);
//console.log('檢查 login 函數是否存在:', userController.login);


router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;