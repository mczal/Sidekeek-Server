// no login
function support(router,connection,sendgrid,config){
  var self=this;
  self.handleRoutes(router,connection,sendgrid,config);
}

support.prototype.handleRoutes = function(router,connection,sendgrid,config){
  router.post('/support',function(req,res){
    var subject = req.body.subject;
    var email = req.body.email;
    var title = req.body.title;
    var message = req.body.message;
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.status(422).json({"message":"err.. error no param s_c rec","error":"error"});
    }else{
      if(email == null || email == undefined || email == ''){
        res.status(422).json({"message":"err.. error no param e rec","error":"error"});
      }else{
        if(subject == null || subject == undefined || subject == ''){
          res.status(422).json({"message":"err.. error no param s rec","error":"error"});
        }else{
          if(title == null || title == undefined || title == ''){
            res.status(422).json({"message":"err.. error no param t rec","error":"error"});
          }else{
            if(message == null || message == undefined || message == ''){
              res.status(422).json({"message":"err.. error no param m rec","error":"error"});
            }else{
              // 1. lookup sessionCode
              var query = "select host.id_host,host.email from `session_host` join `host` on session_host.id_host=host.id_host where session_code='"+sessionCode+"'";
              connection.query(query,function(err,rows){
                if(err){
                  res.status(500).json({"message":"err.. error on checking sess quey","q":query});
                }else{
                  if(rows.length>0){
                    var idHost = rows[0].id_host;
                    var email = rows[0].email;
                    sendgrid.send({
                      to:       config.cs_email,
                      from:     email,
                      subject:  'Support - Customer ('+title+') <Subject : '+subject+'> <From : id: '+idHost+' >',
                      text:     message,
                      html:     "<h3>"+subject+"</h3><br><h4>"+title+"</h4><br><p>"+message+"</p>",
                    }, function(err, json) {
                      if (err) {
                        res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                        return console.error(err);
                      }
                      res.json({"message":"success sending feedback to our customer services","error":"success","status":"feedback","jsonsgrid":json}); //status 0 berarti signup doang
                      console.log(json);
                    });
                  }else{
                    res.status(401).json({"message":"err.. no rows on session"});
                  }
                }
              });
            }
          }
        }
      }
    }
  });
}

module.exports = support;
