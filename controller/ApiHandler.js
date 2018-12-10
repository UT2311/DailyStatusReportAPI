var UserORMServices = require('../controller/ORMHandler');
var ErrorObj = require('../controller/ErrorHandler');
var db = require('../controller/db');
function userServices()
{
    this.signup = function(req,res){
        var userName = req.body.username;
        var password = req.body.password;

        if( userName && password ) {
            
            if(password.length<6){
                res.send(ErrorObj.sendErrorResponse(406 ,"Password should be more then 6 character long"));
            }
            UserORMServices.signup(req,res);
        }
        else{
            res.send(ErrorObj.sendErrorResponse(406 ,"Username/Password not provided"));
        }
    }
}
var userObj = new userServices();
module.exports = userObj;