var ErrorObj = require('../controller/ErrorHandler');
var jwt = require('jsonwebtoken');
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
module.exports = userTable;