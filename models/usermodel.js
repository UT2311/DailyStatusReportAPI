var request = require("request");
var ErrorObj = require('../controller/ErrorHandler');
var jwt = require('jsonwebtoken');
//Database Initilisation
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

//Application Functions
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
function resetSequenceValue(database,sequenceName){
    return new Promise(function(resolve,reject){
        var collection = database.collection("counter");
        collection.findOneAndUpdate(
            { _id :  sequenceName},
            { $inc:{count:-1} },
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
function deleteApplication(database,AppID){
    return new Promise(function(resolve,reject){
        AppID = parseInt(AppID);
        var collection = database.collection("applications");
        collection.deleteOne(
            {
                _id:AppID,
            }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function updateApplication(database,AppID,ApplicationName,applicationSize){
    return new Promise(function(resolve,reject){
        var collection = database.collection("applications");
        AppID = parseInt(AppID);
        collection.findOneAndUpdate(
            {_id:AppID},
            {
                $set:{
                    appicationName: ApplicationName,
                    sizeOfApplication:applicationSize
                }
            },
            {
                returnNewDocument: true
            }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function deleteAT(database,assistiveTechnologyID){
    return new Promise(function(resolve,reject){
        var collection = database.collection("assistivetech");
        AppID = parseInt(assistiveTechnologyID);
        collection.deleteOne(
            {_id:AppID}
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function updateAT(database,assistiveTechnologyID,assistiveTechnology){
    return new Promise(function(resolve,reject){
        var collection = database.collection("assistivetech");
        AppID = parseInt(assistiveTechnologyID);
        collection.findOneAndUpdate(
            {_id:AppID},
            {
                $set:{
                    assistiveTechName:assistiveTechnology
                }
            },
            {
                returnNewDocument: true
            }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}
function insertAT(database,sequenceID,assistiveTechnology){
    return new Promise(function(resolve,reject){

        var collection = database.collection("assistivetech");
        AppID = parseInt(sequenceID);
        collection.insertOne(
           {
                _id:AppID,
                assistiveTechName:assistiveTechnology
           }
        )
        .then(result=>{resolve(result);})
        .catch(error => {reject(error)})
    });
}

//Application Handler
function applicationHandler()
{
    this.insertApplication = function(req,res){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                    var applicationName = req.body.ApplicationName;
                    var applicationSize = req.body.ApplicationSize;  
                    var counterInitialise = makeCounterIfUnavalable(database,"applications_id");
                    counterInitialise
                    .then(respose => {
                        var sequenceID = getNextSequenceValue(database,"applications_id");
                        sequenceID
                        .then(sequenceDoc => {
                            var getSavedStatus = saveApplication(database,applicationName,applicationSize,(sequenceDoc.value.count+1));
                            getSavedStatus
                            .then(savedResponse => {resolve(ErrorObj.sendSuccessResponse(200,"Application Saved Successfully",savedResponse.insertedId))})
                            .catch(errorResponse => {
                                var counterResetStatus = resetSequenceValue(database,"applications_id");
                                counterResetStatus
                                .then(response => {reject(ErrorObj.sendErrorResponse(400,"Application Failed To Save "+response.value.count))})
                                .catch(error => {reject(ErrorObj.sendErrorResponse(400,"Application Failed To Save & Counter Failed to decrement "+response))})
                                })
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
    this.deleteApplication = function(AppID){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                var deleteStatus = deleteApplication(database,AppID);
                deleteStatus
                .then(response => {resolve(ErrorObj.sendSuccessResponse(200,"Application Successfully Deleted",response))})
                .catch(error =>{reject(ErrorObj.sendErrorResponse(400,"Application Cannot Be Deleted "+error))})
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
    this.updateApplication = function(AppID,applicationName,applicationSize){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                var updateStatus = updateApplication(database,AppID,applicationName,applicationSize);
                updateStatus
                .then(response => {resolve(ErrorObj.sendSuccessResponse(200,"Application Updated",response))})
                .catch(error =>{reject(ErrorObj.sendErrorResponse(200,"Application Cannot Be Updated",error))})
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
    this.deleteAT = function(assistiveTechnologyID){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                var deleteATStatus = deleteAT(database,assistiveTechnologyID);
                deleteATStatus
                .then(response => {resolve(ErrorObj.sendSuccessResponse(200,"AT deleted",response))})
                .catch(error =>{reject(ErrorObj.sendErrorResponse(200,"AT Cannot Be Deleted",error))})
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
    this.updateAT = function(assistiveTechnologyID,assistiveTechnology){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                var updateATStatus = updateAT(database,assistiveTechnologyID,assistiveTechnology);
                updateATStatus
                .then(response => {resolve(ErrorObj.sendSuccessResponse(200,"AT Updated",response))})
                .catch(error =>{reject(ErrorObj.sendErrorResponse(200,"AT Cannot Be Updated",error))})
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
    this.insertAT = function(assistiveTechnology){
        return new Promise(function(resolve,reject){
            var getdb = initialise();
            getdb
            .then(database => {
                var counterInitialise = makeCounterIfUnavalable(database,"assistivetech");
                    counterInitialise
                    .then(respose => {
                        var sequenceID = getNextSequenceValue(database,"assistivetech");
                        sequenceID
                        .then(sequenceDoc => {
                            var getSavedStatus = insertAT(database,(sequenceDoc.value.count+1),assistiveTechnology);
                            getSavedStatus
                            .then(savedResponse => {resolve(ErrorObj.sendSuccessResponse(200,"AT Saved Successfully",savedResponse.insertedId))})
                            .catch(errorResponse => {
                                var counterResetStatus = resetSequenceValue(database,"assistivetech");
                                counterResetStatus
                                .then(response => {reject(ErrorObj.sendErrorResponse(400,"AT Failed To Save "+errorResponse))})
                                .catch(error => {reject(ErrorObj.sendErrorResponse(400,"AT Failed To Save & Counter Failed to decrement "+errorResponse))})
                                })
                        })
                        .catch(err => {reject(ErrorObj.sendErrorResponse(400,"Cannot insert the application error is ---"+err));})
                    })
                    .catch(err => {reject(ErrorObj.sendErrorResponse(400,"Cannot make counter for the perticular application error--"+err));})
            })
            .catch(err =>{reject(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB error --"+err));})
        });
    }
}



//User Functions
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

//User Handler
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