var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function confirmation(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
confirmation.prototype.handleRoutes = function(router,connection){
  router.post("/confirmation",function(req,res){
    var uniqueCode = req.body.uniqueCode;
    connection.query("select id_host from `host` where unique_code='"+uniqueCode+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting host with given uniqueCode"});
      }else{
        if(rows.length>0){
          var idHost = rows[0].id_host;
          connection.query("update `host` set statusz=1 where id_host="+idHost,function(err,rows){
            if(err){
              res.json({"message":"err.. error confirming your host's account"});
            }else{
              res.json({"message":"success, your host has been confirmed"});
            }
          });
        }else{
          res.json({"message":"err.. no rows mean no host registered with given uniquecode"});
        }
      }
    });
  });
}

module.exports = confirmation;
