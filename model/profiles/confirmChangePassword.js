function confirmChangePassword(router,connection,jwt,app,sendgrid,md5){
  var self=this;
  self.handleRoutes(router,connection,jwt,app,sendgrid,md5);
}

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

confirmChangePassword.prototype.handleRoutes = function(router,connection,jwt,app,sendgrid,md5){
  router.post("/confirmChangePassword",function(req,res){
    var token = req.body.token;
    if(token){
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good
          if(decoded.id_host){
            var code = generateUniqueCode();
            var query = "UPDATE `host` SET password='"+md5(code)+"' where id_host="+decoded.id_host;
            connection.query(query,function(err,rows){
              if(err){
                res.status(500).json({"message":"err.. error on password replacement","error":"error"});
              }else{
                // 4. Sending confirmation email
                sendgrid.send({
                  to:       decoded.email,
                  from:     'noreply-sidekeek@sidekeek.co',
                  subject:  'Password Replacement Success',
                  text:     'Here is your new password '+code,
                  html:     "<p>Here is your new password <b>'"+code+"'</b></p>",
                }, function(err, json) {
                  if (err) {
                    res.json({"message":'AAAAAHH!!',"err":err,"error":"error","email":decoded.email,"jsonsgrid":null});
                    return console.error(err);
                  }
                  res.status(200).json({"message":"success change replace password, see your new generated password on your email","error":"success","email":decoded.email,"jsonsgrid":json});
                  console.log(json);
                });
              }
            });
          }
        }
      });
    }else{
      res.status(442).json({"message":"err.. error no params rec","error":"error"});
    }
  });
}

module.exports = confirmChangePassword;
