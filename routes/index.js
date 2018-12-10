var express = require('express');
var router = express.Router();
var userAuthenticator  =   require('../middlewares/AuthenticateUser');
// for connecting controller
var apiController = require("../controller/ApiHandler");
var requestController = require("../controller/RequestController");

/* Api Without MiddleWares */
router.post("/signup",apiController.signup);

// Api With Middlewares
router.post("/getAllApplications",userAuthenticator,requestController.getAllApplication);
module.exports = router;