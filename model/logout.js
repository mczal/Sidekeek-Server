var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function logout(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

logout.prototype.handleRoutes = function(router,connection){
  router.post("/logout",function(req,res){
    var sessionCode=req.body.sessionCode;
    if(sessionCode==null || sessionCode==undefined || sessionCode==""){
      res.json({"message":"err.. no params code receive","error":"error"});
    }else{
      connection.query("select id_session from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error in selecting id_session","error":"error"});
          }else{
            if(rows.length>0){
              var idSession = rows[0].id_session;
              connection.query("delete from `session_host` where id_session="+idSession,function(err,rows){
                if(err){
                  res.json({"message":"err.. error in deleting session"});
                }else{
                  res.json({"message":"Success drop session"});
                }
              });
            }else{
              res.json({"message":"--there's no session registered with given code","error":"invalidSession"});
            }
          }
      });
    }

  });
}

module.exports = logout;
