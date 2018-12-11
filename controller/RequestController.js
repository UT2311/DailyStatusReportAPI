var UserORMServices = require('../controller/ORMHandler');
//Middleware including start
//middleware including end
var ErrorObj = require('../controller/ErrorHandler');
function userServices()
{
    this.getAllApplication = function(req,res){
        res.send("I got the application");
    }
    this.insertApplication = function(req,res){
        var applicationName = req.body.ApplicationName;
        var applicationSize = req.body.ApplicationSize;
        if(applicationName){
            if(applicationSize){
                var appInsertStatus = UserORMServices.insertApplication(req,res);
                appInsertStatus
                .then(response => {res.status(200).send(response)})
                .catch(error => {res.status(400).send(error)})
            }
            else
               res.send(ErrorObj.sendErrorResponse(404,"Application Size not found"));
        }
        else{
            res.send(ErrorObj.sendErrorResponse(404,"Application Name not found"));
        }
    }
}
var userObj = new userServices();
module.exports = userObj;