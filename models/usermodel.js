var request = require("request");
var ErrorObj = require('../controller/ErrorHandler');
var jwt = require('jsonwebtoken');

function initialise()
{
    var db = require('../controller/db').getDb().db();
    return new Promise(function(resolve, reject) {
    	// Do async job
        if(db)
            resolve(db);
        else
            reject(err);
    })
}
function createCounter(database,counterID)
{
    return new Promise(function(resolve, reject) {
        var collection =  database.collection("counter");
        collection.insertOne({"_id":counterID,"count":0})
        .then(result => {resolve(result)})
        .catch(err => {reject(err)})
     }); 
}
function makeCounterIfUnavalable(database,counterID){
    return new Promise(function(resolve, reject) {
        var collection =  database.collection("counter");
        collection.find({_id:counterID}).toArray(function(err, items){
            if(err){
                reject(err);
            }
            if(items.length > 0){
                resolve(items);
            }
            else
            {
                var counterCreated = createCounter(database,counterID);
                    counterCreated.then(function(result){
                        resolve(items);
                    })
            }
        });
    });
     
}
function getNextSequenceValue(database,sequenceName){
    return new Promise(function(resolve,reject){
        var collection = database.collection("counter");
        collection.findOneAndUpdate(
            { _id :  sequenceName},
            { $inc:{count:1} },
            { returnNewDocument: true }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function saveApplication(database,ApplicationName,ApplicationSize,sequenceID)
{
    return new Promise(function(resolve,reject){
        var collection = database.collection("applications");
        collection.insertOne(
            {
                _id:sequenceID,
                appicationName: ApplicationName,
                sizeOfApplication:ApplicationSize
            }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function getAllApplications(database){
    return new Promise(function(resolve,reject){
        var collection = database.collection("applications");
        collection.find({},{_id:0}).toArray(function(err, items){
            if(err){
                reject(err);
            }
                resolve(items);
        });
    });
    // {
    //     _id:0,
    //     appicationName: 1,
    //     sizeOfApplication:1
    // }
}
function applicationHandler()
{
    this.insertApplication = function(req,res){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(result => {
                    var applicationName = req.body.ApplicationName;
                    var applicationSize = req.body.ApplicationSize;  
                    var counterInitialise = makeCounterIfUnavalable(result,"applications_id");
                    counterInitialise
                    .then(respose => {
                        var sequenceID = getNextSequenceValue(result,"applications_id");
                        sequenceID
                        .then(sequenceDoc => {
                            var getSavedStatus = saveApplication(result,applicationName,applicationSize,(sequenceDoc.value.count+1));
                            getSavedStatus
                            .then(savedResponse => {resolve(ErrorObj.sendSuccessResponse(200,"Application Saved Successfully",savedResponse.insertedId))})
                            .catch(errorResponse => {reject(ErrorObj.sendErrorResponse(200,"Application Failed To Save "+errorResponse))})
                        })
                        .catch(err => {reject(ErrorObj.sendErrorResponse(400,"Cannot insert the application error is ---"+err));})
                    })
                    .catch(err => {reject(ErrorObj.sendErrorResponse(400,"Cannot make counter for the perticular application error--"+err));})
    
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
    this.getAllApplication = function(){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                    var allApps = getAllApplications(database);
                    allApps
                    .then(respose => {resolve(ErrorObj.sendSuccessResponse(200,"Application List Successfully Fetched",respose))})
                    .catch(error =>{reject(ErrorObj.sendErrorResponse(500,"Some Problem Fetching Applications error is-"+error))})
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
}
function getPerticularUserDetails(database,userName)
{
    return new Promise(function(resolve,reject){
        var collection = database.collection("users");
        collection.find({username:userName}).toArray(function(err, items){
            if(err){
                reject(ErrorObj.sendErrorResponse(500,"Error in Making User "+err));
            }
            if(items.length > 0){
                resolve(items);
            }
            else
            {
                reject(ErrorObj.sendErrorResponse(404,"User Already Exists"));
            }
        });
    });
} 
function createUser(database,userName,Password){
    return new Promise(function(resolve,reject){
        var collection = database.collection("users");
        collection.insertOne(
            {
                username: userName,
                password:Password
            }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function userTable()
{
    const createToken = () => {
        return jwt.sign({}, 'secret', { expiresIn: '1h' });
    };
    this.signup = function(userName,Password){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(databaseObj => {
                var userDetail = getPerticularUserDetails(databaseObj,userName);
                userDetail
                .then(respose => {
                    //User is there
                    reject(ErrorObj.sendErrorResponse(404,"User Already Exists"));
                })
                .catch(error => {
                    if(error.statusCode)
                    {
                        //User is not there
                        var userCreationstatus = createUser(databaseObj,userName,Password);
                        userCreationstatus
                        .then(response => {console.log(response); resolve(ErrorObj.sendSuccessResponse(200,"User Created Successfully-- ",{userid:response.insertedId,access_token:createToken()}))})
                        .catch(error => {reject(ErrorObj.sendErrorResponse(500,"Error in making USER -- "+error))})
                    }
                    else
                    {
                        console.log(error);
                        reject(ErrorObj.sendErrorResponse(500,"Error in making USER -- "+error.message));
                    }
                })
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
}

var userTable = new userTable();
var applicationHandle = new applicationHandler();
module.exports = {
    userTable,
    applicationHandle
};