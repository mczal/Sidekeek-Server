var mysql = require('mysql');
// var sendgrid = require('sendgrid')('mczal','*3tZR#PQYcd');
//TESTED 27 FEBRUARI 2016

// var urlPort = "8080"; //EMPTY if not neccessary
function signUp(router,pool,md5,config,sendgrid){
  var self=this;
  self.handleRoutes(router,pool,md5,config,sendgrid);
}

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var self=this;

signUp.prototype.handleRoutes = function(router,pool,md5,config,sendgrid){
  router.post("/sign-up",function(req,res){

    pool.getConnection(function(err,connection){
      if(err) {
        res.json({
          message:"err.. connection failed",
          error:"error"
        });
      } else {
        var baseUrlClientPath = config.base_url_client_path;
    var domain_name = config.domain_name;

        var statTemp = connection.escape(req.body.statTemp);
        var email = connection.escape(req.body.email);
        var password = connection.escape(md5(req.body.password));
        var confirmation = connection.escape(md5(req.body.confirmation));
        if(email==null || email==undefined || email==""){
          connection.release(); res.json({"message":"err.. no params em rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
        }else{
          if(req.body.password==null || req.body.password==undefined || req.body.password==""){
            connection.release(); res.json({"message":"err.. no params pass rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
          }else{
            if(req.body.confirmation==null || req.body.confirmation==undefined || req.body.confirmation==""){
              connection.release(); res.json({"message":"err.. no params confirm rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
            }else{
                if(confirmation == password){
                  //check email available...
                  connection.query("select id_host from `host` where email="+email,function(err,rows){
                    if(err){
                      connection.release(); res.json({"message":"err.. error in checking availability email..","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                    }else{
                      if(rows.length>0){
                        connection.release(); res.json({"message":"err.. email is already resgistered","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                      }else{
                        //email are checked and it is available
                        //inserting and registering
                        var query="";
                        var query2="";
                        var uniqueCode = generateUniqueCode();
                        connection.beginTransaction(function(err){
                          if (err) {
                            connection.release(); res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                            return;
                          }
                          query="insert into `host` (email,password,unique_code,statusz) values("+email+","+password+",'"+uniqueCode+"',0)";
                          connection.query(query,function(err,rows){
                            if(err){
                              connection.rollback(function(){
                                connection.release(); res.json({"message":"err.. error in inserting host","query":query,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null,"objErr":err});
                                return;
                              });
                            }else{
                              /*TODO: INI SEND MAIL CONFIRMATION*/
                              sendgrid.send({
                                to:       req.body.email,
                                from:     'noreply-sidekeek@sidekeek.co',
                                subject:  'Sidekeek Account Confirmation',
                                text:     'Please click the following link below to confirm your account on sidekeek.co',
                                html:     "<p>Please click the following link below to confirm your account on sidekeek.co</p><a href='"+domain_name+"#!/confirmation/"+uniqueCode+"'><button>CLICK  ME!!!!</button><p><b>"+uniqueCode+"</b></p></a>",
                              }, function(err, json) {
                                if (err) {
                                  connection.rollback(function(){
                                    connection.release(); res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null,"objErr":err});
                                    return;
                                  });
                                  // return console.error(err);
                                }
                                connection.commit(function(err) {
                                  if (err) {
                                    connection.rollback(function() {
                                      connection.release(); res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                      return;
                                    });
                                  }else{
                                    connection.release(); res.json({"message":"success inserting new host, please proceed with confirmation","error":"success","status":0,"unique_code":uniqueCode,"email":email,"jsonsgrid":json}); //status 0 berarti signup doang
                                  }
                                });
                              });
                            }
                          });
                        });
                      }
                    }
                  });
                }else{
                  connection.release(); res.json({"message":"password and confirmation not match !"});
                }
            }
          }
        }
      }
    });
  });
}

module.exports = signUp;
