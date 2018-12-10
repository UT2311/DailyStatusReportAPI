function objError()
{
    this.sendErrorResponse = function(httpCode,message){
        var responseStatus = Object();
        responseStatus.statusCode = httpCode;
        responseStatus.message = message;
        return responseStatus;
    }
    this.sendSuccessResponse = function(httpCode,message,objData){
        var responseStatus = Object();
        responseStatus.statusCode = httpCode;
        responseStatus.message = message;
        responseStatus.responseObj = objData;  
        return responseStatus;                                                      
    }
}
var errorObj = new objError();
module.exports = errorObj;