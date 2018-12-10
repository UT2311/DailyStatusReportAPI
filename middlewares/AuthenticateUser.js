var jwt = require('jsonwebtoken');
var ErrorObj = require('../controller/ErrorHandler');
module.exports = function(req,res,next) {
    if(req.body.access_token == null) {
        res.send(ErrorObj.sendErrorResponse(400 ,"User Not LoggedIn"));
    } else {
        next();
    }
};