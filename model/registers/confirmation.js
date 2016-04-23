var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function confirmation(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
confirmation.prototype.handleRoutes = function(router,connection){
  router.post("/confirmation",function(req,res){
    var uniqueCode = req.body.uniqueCode;
    if(uniqueCode == null || uniqueCode == undefined || uniqueCode == ''){
      res.json({"message":"err.. no params received"});
    }else{
      connection.query("select email,id_host from `host` where unique_code='"+uniqueCode+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting host with given uniqueCode"});
        }else{
          if(rows.length>0){
            var email = rows[0].email;
            var idHost = rows[0].id_host;
            connection.query("update `host` set statusz=1 where id_host="+idHost,function(err,rows){
              if(err){
                res.json({"message":"err.. error confirming your host's account"});
              }else{
                //bikin sesi baru untuk host ini karena langsung di log in-in otomatis..
                var sessionCode = generateUniqueCode();
                //lookup session dulu
                connection.query("select id_host from `session_host` where id_host="+idHost,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on checking availability session host"});
                  }else{
                    if(rows.length>0){
                      var query = "update `session_host` set session_code='"+sessionCode+"' where id_host="+rows[0].id_host;
                      connection.query(query,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating session host","query":query});
                        }else{
                          //hapus uniqueCode-nya host...
                          connection.query("update `host` set unique_code='done' where id_host="+idHost,function(err,rows){
                            if(err){
                              res.json({"message":"err.. fail updt uniqueOdce"});
                            }else{
                              res.json({"message":"your host has been confirmed, success updating session code, go on","session":sessionCode,"email":email});
                            }
                          });
                        }
                      });
                    }else{
                      var query = "insert into `session_host` (id_host,session_code) values ("+idHost+",'"+sessionCode+"')";
                      connection.query(query,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error create new session","query":query});
                        }else{
                          //hapus uniqueCode-nya host...
                          connection.query("update `host` set unique_code='done' where id_host="+idHost,function(err,rows){
                            if(err){
                              res.json({"message":"err.. fail updt uniqueOdce"});
                            }else{
                              res.json({"message":"your host has been confirmed, success create new session, go on","session":sessionCode,"email":email});
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }else{
            res.json({"message":"err.. no rows mean no host registered with given uniquecode"});
          }
        }
      });
    }
  });
}

module.exports = confirmation;
