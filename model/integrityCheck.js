var mysql = require('mysql');

function integrityCheck(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

integrityCheck.prototype.handleRoutes = function(router,connection){
  router.post("/integrityCheck",function(req,res){
    var sessionCode = req.body.sessionCode;
    connection.query("select id_session from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. selecting query session",});
      }else{
        if(rows.length>0){
          res.json({"message":"Integrity Checked, please proceed","status":"allowed"});
        }else{
          res.json({"message":"err.. error no session","status":"forbidden"});
        }
      }
    });
  });
}

module.exports = integrityCheck;
