const express = require('express')
const router = express.Router()
const authCtrl = require('../controller/auth.controller.js')

router.post('/signUp', authCtrl.signUp)
router.post('/login', authCtrl.logIn);


module.exports = router