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
}            
function userTable()
{
    const createToken = () => {
        return jwt.sign({}, 'secret', { expiresIn: '1h' });
    };
    this.signup = function(req,res){
        var db = require('../controller/db').getDb().db();
        var uname = req.body.username;
        var password = req.body.password;
        db.collection("users").find({username:uname}).toArray(function(err, response) {
            if (err) res.send(ErrorObj.sendErrorResponse(400,"SomeProblem Occured"));
            else{
                if(response.length>0)
                {
                    res.send(ErrorObj.sendErrorResponse(400,"User Already Exists"));
                }
                else
                {
                    db.collection("users").insertOne({"username":uname,"password":password})
                    .then(result => { res.send(ErrorObj.sendSuccessResponse(200,"User Made Successfully",{id:result.insertedId,access_token:createToken()}))})
                    .catch(err => {
                        res.send(ErrorObj.sendErrorResponse(500,"Something Went Wrong -error---"+err));
                      });
                }
               
            }
             
          });
    }
}

var userTable = new userTable();
var applicationHandle = new applicationHandler();
module.exports = {
    userTable,
    applicationHandle
};