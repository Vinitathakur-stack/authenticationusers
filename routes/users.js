const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();


// include user controller
const user_controller = require('../controllers/user');

// routes
router.post('/register',upload.none(),user_controller.user_register);
router.post('/login',user_controller.user_login);

module.exports = router;