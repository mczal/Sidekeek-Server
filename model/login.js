//BELUM DI MODIFFF !!!!
var mysql   = require("mysql");

function login(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

function generateUniqueCode(){
    var text = "";
    var possible = "';:.,./,kmaso-0239_THIS IS SESSION(W_diopw'mSPM3-ASO)'IAKU-PASTI-BISA';l";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var self = this;

login.prototype.handleRoutes = function(router,connection,md5){
  router.post("/login",function(req,res){
    var email = req.body.email;
    var password = md5(req.body.password);
    var timestamp = req.body.timestamp;
    connection.query("select password,id_host from `host` where email='"+email+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error in selecting first check"});
      }else{
        if(rows.length>0){
          var idHost = rows[0].id_host;
          if(password == rows[0].password){
            var sessionCode = generateUniqueCode();
            //lookup session dulu
            connection.query("select id_host from `session_host` where id_host="+idHost,function(err,rows){
              if(err){
                res.json({"message":"err.. error on checking availability session host"});
              }else{
                if(rows.length>0){
                  connection.query("update `session_host` set session_code='"+sessionCode+"',last_activity='"+timestamp+"'",function(err,rows){
                    res.json({"message":"success updating session code, go on","session":sessionCode});
                  });
                }else{
                  connection.query("insert into `session_host` (id_host,session_code,last_activity) values ("+idHost+",'"+sessionCode+"','"+timestamp+"') ",function(err,rows){
                    if(err){
                      res.json({"message":"err.. error create new session"});
                    }else{
                      res.json({"message":"success create new session, go on","session":sessionCode});
                    }
                  });
                }
              }
            });
          }else{
            res.json({"message":"invalid password"});
          }
        }else{
          res.json({"message":"err.. email not available"});
        }
      }
    });
  });
}

module.exports = login;
