var express = require('express');
var router = express.Router();
// for connecting controller
var apiController = require("../controller/ApiHandler");

/* Api Without MiddleWares */
router.post("/signup",apiController.signup);

// Api With Middlewares

module.exports = router;
