var ErrorObj = require('../controller/ErrorHandler');
var userModel  = require('../models/usermodel');



function userORMServices()
{
    this.signup = function(req,res){
        userModel.signup(req,res);
    }
    this.insertApplication = function(req,res){
        userModel.insertApplication(req,res);
    }
}




var userObj = new userORMServices();
module.exports = userObj;