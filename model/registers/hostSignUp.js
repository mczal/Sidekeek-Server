// var sendgrid = require('sendgrid')('mczal','*3tZR#PQYcd');

// var urlPort = "8080"; //EMPTY if not neccessary
function hostSignUp(router,connection,md5,config,sendgrid){
  var self=this;
  self.handleRoutes(router,connection,md5,config,sendgrid);
}

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

hostSignUp.prototype.handleRoutes = function(router,connection,md5,config,sendgrid){
  router.post('/hostSignUp',function(req,res){
    var baseUrlClientPath = config.base_url_client_path;

    var idTipe = connection.escape(req.body.idTipe);
    var idCat = connection.escape(req.body.idCat);
    var compName = connection.escape(req.body.compName);
    var threadTitle = connection.escape(req.body.threadTitle);
    var email = connection.escape(req.body.email);
    var password = connection.escape(md5(req.body.password));
    var confirmation = connection.escape(md5(req.body.confirmation));
    if(idTipe == null || idTipe == undefined || idTipe == ''){
      res.json({"message":"err.. no param t rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
    }else{
      if(idCat == null || idCat == undefined || idCat == ''){
        res.json({"message":"err.. no param c rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
      }else{
        if(compName == null || compName == undefined || compName == ''){
          res.json({"message":"err.. no param c_n rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
        }else{
          if(threadTitle == null || threadTitle == undefined || threadTitle == ''){
            res.json({"message":"err.. no param t_t rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
          }else{
            if(email == null || email == undefined || email == ''){
              res.json({"message":"err.. no param e rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
            }else{
              if(password == null || password == undefined || password == ''){
                res.json({"message":"err.. no param p rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
              }else{
                if(confirmation == null || confirmation == undefined || confirmation == ''){
                  res.json({"message":"err.. no param c rec","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                }else{
                  // 1. Check Email's Availability
                  var query = "select id_host from `host` where email="+email;
                  connection.query(query,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on checking availability q","error":"error","err":err,"status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                    }else{
                      if(rows.length>0){
                        res.json({"message":"email are already registered","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                      }else{
                        // 2. Match password and confirmation
                        if (password == confirmation) {
                          // 3. inserting
                          var uniqueCode = generateUniqueCode();
                          connection.beginTransaction(function(err){
                            if (err) {
                              res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                              return;
                            }
                            var query = "INSERT INTO `host` (id_tipe,category,company_name,title,email,password,unique_code,statusz) "+
                            "VALUES("+idTipe+","+idCat+","+compName+","+threadTitle+","+email+","+password+",'"+uniqueCode+"',0)";
                            connection.query(query,function(err,rows){
                              if(err){
                                connection.rollback(function(){
                                  res.json({"message":"err.. error on inserting new host","error":"error","err":err,"query":query,"status":null,"unique_code":null,"email":email,"jsonsgrid":null,"objErr":err});
                                  return;
                                });
                              }else{
                                var insertId = rows.insertId;
                                // console.log(insertId);
                                // 4. Sending confirmation email
                                sendgrid.send({
                                  to:       req.body.email,
                                  from:     'noreply-sidekeek@sidekeek.co',
                                  subject:  'Sidekeek Account Confirmation',
                                  text:     'Please click the following link below to confirm your account on sidekeek.co',
                                  html:     "<p>Please click the following link below to confirm your account on sidekeek.co</p><a href='"+baseUrlClientPath+"#/confirmation/?uq="+uniqueCode+"'><button>CLICK  ME!!!!</button><p><b>"+uniqueCode+"</b></p></a>",
                                }, function(err, json) {
                                  if (err) {
                                    connection.rollback(function(){
                                      res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null,"objErr":err});
                                      return;
                                    });
                                  }
                                  connection.commit(function(err) {
                                    if (err) {
                                      connection.rollback(function() {
                                        res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                        return;
                                      });
                                    }else{
                                      res.json({"message":"success inserting new host, please proceed with confirmation","error":"success","status":1,"unique_code":uniqueCode,"email":email,"jsonsgrid":json}); //status 0 berarti signup doang
                                    }
                                  });
                                  // console.log(json);
                                });
                              }
                            });
                          });
                        }else{
                          res.json({"message":"password and confirmation didn't match","error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                        }
                      }
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  });
}

module.exports = hostSignUp;
