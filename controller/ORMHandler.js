var ErrorObj = require('../controller/ErrorHandler');
var userModel  = require('../models/usermodel');
var userfunctions = userModel.userTable;
var applicationFunctions = userModel.applicationHandle;


function userORMServices()
{
    this.signup = function(username,password){
        return new Promise(function(resolve,reject){
            var insertUserStatus = userfunctions.signup(username,password);
            insertUserStatus
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
        
    }
    this.insertApplication = function(req,res){
        return new Promise(function(resolve,reject){
            var insertAppStatus = applicationFunctions.insertApplication(req,res);
            insertAppStatus
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.getAllApplication = function(){
        return new Promise(function(resolve,reject){
            var allApps = applicationFunctions.getAllApplication();
            allApps
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
}




var userObj = new userORMServices();
module.exports = userObj;