function requestChangePassword(router,connection,jwt,sendgrid,app,config){
  var self=this;
  self.handleRoutes(router,connection,jwt,sendgrid,app,config);
}

requestChangePassword.prototype.handleRoutes = function(router,connection,jwt,sendgrid,app,config){
  router.post('/requestChangePassword',function(req,res){
    var email = req.body.email;
    var baseUrlClientPath = config.base_url_client_path;
    var path = req.body.path;
    if(email){
      if(path){
        //1.  lookup email
        var query = "SELECT id_host,statusz FROM `host` WHERE email='"+email+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.status(500).json({"message":"err.. error on lookup email #"+email,"error":"error"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var statusz = rows[0].statusz;
              if(statusz == 1){
                  var token = jwt.sign({
                  id_host :rows[0].id_host,
                  email :email,
                  info: "/requestChangePassword",
                  timestamp: new Date()
                }, app.get('superSecret'), {
                  expiresInMinutes: 1440 // expires in 24 hours
                });
                // 4. Sending confirmation email
                sendgrid.send({
                  to:       email,
                  from:     'noreply-sidekeek@sidekeek.co',
                  subject:  'Request For Change Password Confirmation',
                  text:     'Please click the following link below to confirm your password replacement on sidekeek.co',
                  html:     "<p>Please click the following link below to confirm your account on sidekeek.co</p><a href='"+baseUrlClientPath+"#/"+path+"/?token="+token+"'><button>CLICK  ME!!!!</button><p><b>"+token+"</b></p></a>",
                }, function(err, json) {
                  if (err) {
                    res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                    return console.error(err);
                  }
                  res.status(200).json({"message":"success sent confirmation email, please proceed with confirmation","error":"success","email":email,"jsonsgrid":json});
                  console.log(json);
                });
              }else{
                res.status(401).json({"message":"err.. account has not been confirmed","error":"error"});
              }
            }else{
              res.status(404).json({"message":"err.. email not found","error":"error"});
            }
          }
        });
      }else{
        res.status(422).json({"message":"err.. error no param p rec","error":"error"});
      }
    }else{
      res.status(422).json({"message":"err.. error no em param rec","error":"error"});
    }
  });
}

module.exports = requestChangePassword;
