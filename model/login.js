
var mysql   = require("mysql");
//TESTED 27 FEBRUARI 2016
function login(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-+_";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var self = this;

login.prototype.handleRoutes = function(router,connection,md5){
  router.post("/login",function(req,res){
    var email = connection.escape(req.body.email);
    var password = md5(req.body.password);
    if(email==null || email==undefined || email==""){
      res.json({"message":"err.. no params em received"});
    }else{
      if(password==null || password==undefined || password==""){
        res.json({"message":"err.. no params pass received"});
      }else{
        connection.query("select unique_code,password,id_host,statusz,id_tipe from `host` where email="+email+"",function(err,rows){
          if(err){
            res.json({"message":"err.. error in selecting first check"});
          }else{
            if(rows.length>0){
              var idTipe = rows[0].id_tipe;
              var statusz = rows[0].statusz;
              var uniqueCode = rows[0].unique_code;
              var idHost = rows[0].id_host;
              if(password == rows[0].password){
                if(statusz == 1){
                  var sessionCode = generateUniqueCode();
                  //lookup session dulu
                  var query1 = "select id_host from `session_host` where id_host="+idHost;
                  connection.query(query1,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on checking availability session host","q":query1});
                    }else{
                      if(rows.length>0){
                        // 5. update last activity
                        var myDate = new Date();
                        var myTimestamp = myDate.getFullYear()+"-"+myDate.getMonth()+
                        "-"+myDate.getDate()+" "+myDate.getHours()+
                        ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                        var query = "update `session_host` set session_code='"+sessionCode+"',last_activity='"+myTimestamp+"' where id_host="+idHost;
                        connection.query(query,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on updating session host","query":query});
                          }else{
                              var tipe = (idTipe==null ? "seeker" : (idTipe==1 ? "goods" : "services"));
                              res.json({"message":"success updating session code, go on","session":sessionCode,"idHost":idHost,"idType":idTipe,"type":tipe});
                          }
                        });
                      }else{
                        // 5. update last activity
                        var myDate = new Date();
                        var myTimestamp = myDate.getFullYear()+"-"+myDate.getMonth()+
                        "-"+myDate.getDate()+" "+myDate.getHours()+
                        ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                        var query = "insert into `session_host` (id_host,session_code,last_activity) values ("+idHost+",'"+sessionCode+"','"+myTimestamp+"') ";
                        connection.query(query,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error create new session","query":query});
                          }else{
                            var tipe = (idTipe==null ? "seeker" : (idTipe==1 ? "goods" : "services"));
                            res.json({"message":"success create new session, go on","session":sessionCode,"idHost":idHost,"idType":idTipe,"type":tipe});
                          }
                        });
                      }
                    }
                  });
                }else{
                  res.json({"message":"you must do the confirmation first","uniqueCode":uniqueCode});
                }
              }else{
                res.json({"message":"invalid password"});
              }
            }else{
              res.json({"message":"err.. email not available"});
            }
          }
        });
      }
    }
  });
}

module.exports = login;
