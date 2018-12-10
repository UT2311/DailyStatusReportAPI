
//Middleware including start
//middleware including end

function userServices()
{
    this.getAllApplication = function(req,res){
        res.send("I got the application");
    }
}
var userObj = new userServices();
module.exports = userObj;