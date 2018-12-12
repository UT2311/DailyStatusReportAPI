var ErrorObj = require('../controller/ErrorHandler');
var userModel  = require('../models/usermodel');
var userfunctions = userModel.userTable;
var applicationFunctions = userModel.applicationHandle;
var assistiveTech = userModel.assistiveTech;
var linkDBObj = userModel.linkDb;

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
    this.deleteApplication = function(AppID){
        return new Promise(function(resolve,reject){
            var deleteAppStatus = applicationFunctions.deleteApplication(AppID);
            deleteAppStatus
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.updateApplication = function(AppID,applicationName,applicationSize){
        return new Promise(function(resolve,reject){
            var updateAppStatus = applicationFunctions.updateApplication(AppID,applicationName,applicationSize);
            updateAppStatus
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
    this.deleteAT = function(assistiveTechnologyID){
        return new Promise(function(resolve,reject){
            var deleteATStatus = assistiveTech.deleteAT(assistiveTechnologyID);
            deleteATStatus
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.updateAT = function(assistiveTechnologyID,assistiveTechnology){
        return new Promise(function(resolve,reject){
            var updateATStatus = assistiveTech.updateAT(assistiveTechnologyID,assistiveTechnology);
            updateATStatus
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.insertAT = function(assistiveTechnology){
        return new Promise(function(resolve,reject){
            var insertATStatus = assistiveTech.insertAT(assistiveTechnology);
            insertATStatus
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.addLinkDB = function(dbName,linkToDB){
        return new Promise(function(resolve,reject){
            var insertdbLink = linkDBObj.addLinkDB(dbName,linkToDB);
            insertdbLink
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.deleteLinkDB = function(linkID){
        return new Promise(function(resolve,reject){
            var deleteLinkDB = linkDBObj.deleteLinkDB(linkID);
            deleteLinkDB
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.updateLinkDB = function(linkID,dbName,linkToDB){
        return new Promise(function(resolve,reject){
            var updateLinkDB = linkDBObj.updateLinkDB(linkID,dbName,linkToDB);
            updateLinkDB
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        });
    }
    this.getallDBLinks = function(){
        return new Promise(function(resolve,reject){
            var getallDBLinks = linkDBObj.getallDBLinks();
            getallDBLinks
            .then(response => {resolve(response)})
            .catch(error => {reject(error)})
        }); 
    }
}




var userObj = new userORMServices();
module.exports = userObj;