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
        collection.insertOne({"_id":counterID,"count":0}).toArray(function(err, items){
             if (err) {
                reject(err);
             } else {  
                resolve(items);
           } 
        });
     }); 
}
function makeCounterIfUnavalable(database,counterID){
    return new Promise(function(resolve, reject) {
       var collection =  database.collection("counter");
       collection.find({"_id":counterID}).toArray(function(err, items){
            if (err) {
                reject(err);
            } else {
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
        ).then(function(err, items){
            if (err) {
                reject(err);
            } else {
                resolve(items);
          }
        });
    });
}
            
function userTable()
{

    //  function makeCounterIfNotThere(counterID){
    //     var db = require('../controller/db').getDb().db();
    //     db.collection("counter").find({"_id":counterID}).toArray(function(err, response) {
    //         if (err) res.send(ErrorObj.sendErrorResponse(400,"SomeProblem Occured"));
    //         else{
    //             if(response.length <= 0)
    //             {
    //                 //create counter 
    //                 db.collection("counter").insertOne({"_id":counterID,"count":0})
    //                 .then(result => { return true})
    //                 .catch(err => {
    //                     return ErrorObj.sendErrorResponse(500,"Something Went Wrong -error---"+err);
    //                 });
    //             }
    //         }
    //     });
    //  }
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
    this.insertApplication = function(req,res){
        var getdb = initialise();
        getdb
        .then(function(result){
                var applicationName = req.body.ApplicationName;
                var applicationSize = req.body.ApplicationSize;  
                var counterInitialise = makeCounterIfUnavalable(result,"applications_id");
                // counterInitialise
                // .then(function(respose){
                //     var sequenceID = getNextSequenceValue(result,"applications_id");
                //     sequenceID
                //     .then(function(result){
                //         console.log(result);
                //     })
                // })
                // .catch(err)
                // {
                //     res.send("error");
                // }
        })
         .catch(err)
         {
             res.send(ErrorObj.sendErrorResponse(500,"Cannot Initialise DB"));
         }
    
        
        // db.collection("counter").find({"_id":counterID}).toArray(function(err, response) {
        //     if (err) res.send(ErrorObj.sendErrorResponse(400,"SomeProblem Occured"));
        //     else{
        //         if(response.length <= 0)
        //         {
        //             //create counter 
        //             db.collection("counter").insertOne({"_id":counterID,"count":0})
        //             .then(result => { return true})
        //             .catch(err => {
        //                 return ErrorObj.sendErrorResponse(500,"Something Went Wrong -error---"+err);
        //             });
        //         }
        //     }
        // });
        // makeCounterIfNotThere("applications_id").then(result => {console.log(result)});
        // var getNextSequenceValue = function(sequenceName){
        //     db.collection("counter").findOneAndUpdate(
        //         { _id :  sequenceName},
        //         { $inc:{count:1} },
        //         { returnNewDocument: true }
        //     )
        //     .then(result => { 
        //         console.log(result);
        //         console.log(applicationName);
        //         console.log(applicationSize);
        //         db.collection("applications").insertOne({"_id":result.value.count,"appicationName":applicationName,"sizeOfApplication":applicationSize})
        //         .then(result => { res.send(ErrorObj.sendSuccessResponse(200,"Application Inserted Successfully",{id:result.insertedId}))})
        //         .catch(err => {
        //             res.send(ErrorObj.sendErrorResponse(500,"Something Went Wrong -error---"+err));
        //           });
        //     })
        // }("applications_id");
      
       
    }
}

var userTable = new userTable();
module.exports = userTable;