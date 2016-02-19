var mysql = require('mysql');

function confirmation(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
//BINGUNGG...!!
//DEPRECATED
confirmation.prototype.handleRoutes = function(router,connection){
  router.get("/confirmation",function(req,res){
    var uniqueCode = req.body.uniqueCode;
    connection.query("select ",function(err,rows){

    });
  });
}

module.exports = confirmation;
