const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.post('/Register', authController.Register)


module.exports = router;