function resendMailConfirmationCode(router,connection,sendgrid,config){
  var self=this;
  self.handleRoutes(router,connection,sendgrid,config);
}

resendMailConfirmationCode.prototype.handleRoutes = function(router,connection,sendgrid,config){
  router.post('/resendMailConfirmationCode',function(req,res){
    var email = req.body.email;
    if(email){
      // 1. Lookup email if exist and not confirmed
      var query = "select id_host,statusz,unique_code from `host` where email="+connection.escape(email);
      connection.query(query,function(err,rows){
        if (err) {
          res.status(500).json({"message":"err.. error on lookup email","error":"error"});
        }else {
          if (rows.length>0) {
            if(rows[0].statusz == 0){
              /*TODO: INI SEND MAIL CONFIRMATION*/
              sendgrid.send({
                to:       email,
                from:     'noreply-sidekeek@sidekeek.co',
                subject:  'Sidekeek Account Confirmation',
                text:     'Please click the following link below to confirm your account on sidekeek.co',
                html:     "<p>Please click the following link below to confirm your account on sidekeek.co</p><a href='"+baseUrlClientPath+"#/confirmation/?uq="+uniqueCode+"'><button>CLICK  ME!!!!</button><p><b>"+uniqueCode+"</b></p></a>",
              }, function(err, json) {
                if (err) {
                  res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                  return console.error(err);
                }
                res.json({"message":"success resend email confirmation, please proceed with confirmation","error":"success","status":"unidentified","unique_code":rows[0].unique_code,"email":email,"jsonsgrid":json}); //status 0 berarti signup doang
                console.log(json);
              });
            }else{
              res.status(401).json({"message":"err.. email has been confirmed","error":"error"});
            }
          }else {
            res.status(404).json({"message":"err.. email not found","error":"error"});
          }
        }
      });
    }else{
      res.status(422).json({"message":"err.. error no param e rec","error":"error"});
    }
  });
}

module.exports = resendMailConfirmationCode;
