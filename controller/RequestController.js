var UserORMServices = require('../controller/ORMHandler');
//Middleware including start
//middleware including end
var ErrorObj = require('../controller/ErrorHandler');
function userServices()
{
    this.getAllApplication = function(req,res){
        var allApplications = UserORMServices.getAllApplication();
        allApplications
            .then(response => {res.status(200).send(response)})
            .catch(error => {res.status(400).send(error)})
    }
    this.insertApplication = function(req,res){
        var applicationName = req.body.ApplicationName;
        var applicationSize = req.body.ApplicationSize;
        var AppID = req.body.AppID;
        var operation = req.body.operation;
        if(operation == 1)
        {
            //insert
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
        else if(operation == -1)
        {
            //delete
            if(AppID){
                var deleteStatus = UserORMServices.deleteApplication(AppID);
                    deleteStatus
                    .then(response => {res.status(200).send(response)})
                    .catch(error => {res.status(400).send(error)})
            }
            else{
                res.send(ErrorObj.sendErrorResponse(404,"ApplicationID not found"));
            }
        }
        else if(operation == 0)
        {
            //update
            if(AppID){
                if(applicationName){
                    if(applicationSize){
                        var appInsertStatus = UserORMServices.updateApplication(AppID,applicationName,applicationSize);
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
            else{
                res.send(ErrorObj.sendErrorResponse(404,"ApplicationID not found"));
            }
        }
        else
        {
            res.send(ErrorObj.sendErrorResponse(404,"Please Provide An Correct Operation-- 0-Update,1-Insert,-1-Delete"));
        }
    }
    this.insertDeleteUpdateATS = function(req,res){
        var assistiveTechnology = req.body.AssistiveTechnology;
        var assistiveTechnologyID = req.body.AIID;
        var operations = req.body.options;
        if(operations == -1){
            if(assistiveTechnologyID){
                var deleteStatus = UserORMServices.deleteAT(assistiveTechnologyID);
                deleteStatus
                .then(response => {res.status(200).send(response)})
                .catch(error => {res.status(400).send(error)})
            }
            else
             res.send(ErrorObj.sendErrorResponse(404,"Please Provide An ID for Assistive Technology Deletion"));
        }
        else if(operations == 0){
            if(assistiveTechnologyID){
                if(assistiveTechnology){
                    var updateStatus = UserORMServices.updateAT(assistiveTechnologyID,assistiveTechnology);
                    updateStatus
                    .then(response => {res.status(200).send(response)})
                    .catch(error => {res.status(400).send(error)})
                }
                else
                  res.send(ErrorObj.sendErrorResponse(404,"Please Provide An Assistive Technology Updation"));
            }
            else
             res.send(ErrorObj.sendErrorResponse(404,"Please Provide An ID for Assistive Technology ID for Updation"));
        }
        else if(operations == 1){
            if(assistiveTechnology){
                var insertStatus = UserORMServices.insertAT(assistiveTechnology);
                insertStatus
                .then(response => {res.status(200).send(response)})
                .catch(error => {res.status(400).send(error)})
            }
            else
              res.send(ErrorObj.sendErrorResponse(404,"Please Provide An Assistive Technology Insertion"));
        }
        else
             res.send(ErrorObj.sendErrorResponse(404,"Please Provide Operation to do -- 0-Update 1-Insert -1-Delete"));
    }
}
var userObj = new userServices();
module.exports = userObj;