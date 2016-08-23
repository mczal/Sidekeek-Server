// no login
function support(router,connection,sendgrid,config){
  var self=this;
  self.handleRoutes(router,connection,sendgrid,config);
}

support.prototype.handleRoutes = function(router,connection,sendgrid,config){
  router.post('/support',function(req,res){
    var subject = req.body.subject;
    var title = req.body.title;
    var message = req.body.message;
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.status(422).json({"message":"err.. error no param s_c rec","error":"error"});
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
                  var emailCut = email.split('@');
                  sendgrid.send({
                    to:       config.cs_email,
                    from:     emailCut[0]+"@sidekeek-user.co",
                    subject:  'Support - Customer ('+title+') <Subject : '+subject+'> <From : id: '+idHost+' >',
                    text:     message,
                    html:     "<h3>Subject : "+subject+"</h3><br><h4>Title : "+title+"</h4><br>Message : <br><p>"+message+"</p>",
                  }, function(err, json) {
                    if (err) {
                      res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                      return console.error(err);
                    }
                    var myDate = new Date();
                    var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                    "-"+myDate.getDate()+" "+myDate.getHours()+
                    ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                    var q0 = "UPDATE `session_host` SET last_activity='"+myTimestamp+"' WHERE id_host="+idHost;
                    connection.query(q0,function(err,rows){
                      if(err){
                        res.status(500).json({"message":"fail to update status, email success sent","error":"mid"});
                      }else{
                        res.json({"message":"success sending support to our customer services","error":"success","status":"support","jsonsgrid":json}); //status 0 berarti signup doang
                        console.log(json);
                      }
                    });
                  });
                }else{
                  res.status(401).json({"message":"err.. no rows on session","error":"invalidSession"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = support;
