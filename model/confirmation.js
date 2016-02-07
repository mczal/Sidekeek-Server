var mysql = require('mysql');

function confirmation(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
//BINGUNGG...!!
confirmation.prototype.handleRoutes = function(router,connection){
  router.get("/confirmation",function(req,res){
    var uniqueId = req.body.uniqueId;
    connection.query("",function(err,rows){
      
    });
  });
}

module.exports = confirmation;
