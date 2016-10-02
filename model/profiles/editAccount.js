var mysql = require('mysql');
var mkpath = require('mkpath');
function editAccount(router,connection,fs){
  var self=this;
  self.handleRoutes(router,connection,fs);
}

var self=this;

editAccount.prototype.handleRoutes = function(router,connection,fs){
  router.post('/editAccount',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params received"});
    }else{
      var query = "select session_host.id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_code='"+sessionCode+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting sess hos","error":"error","query":query});
        }else{
          if(rows.length>0){
            var email = rows[0].email;
            var idHost = rows[0].id_host;
            // var imgbase64 = req.body.imgbase64;
            var companyName = req.body.companyName;
            var about = req.body.about;
            var handphone = req.body.handphone;
            var city = req.body.city;
            var address = req.body.address;
            if(companyName == null || companyName == undefined || companyName == ''){
              res.json({"message":"err.. no params rec,.","error":"error"});
            }else{
              if(about == null || about == undefined || about == ''){
                res.json({"message":"err.. no params rec about","error":"error"});
              }else{
                if(handphone == null || handphone == undefined || handphone == ''){
                  res.json({"message":"err.. no params rec handphone","error":"error"});
                }else{
                  if(city == null || city == undefined || city == ''){
                    res.json({"message":"err.. no params rec city","error":"error"});
                  }else{
                    if(address == null || address == undefined || address == ''){
                      res.json({"message":"err.. no params rec address","error":"error"});
                    }else{
                      // if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
                        var quer = "update `host` set company_name='"+companyName+"',about='"+about+"',handphone='"+handphone+"',location="+city+",address='"+address+"' where id_host ="+idHost;
                        console.log(quer);
                        connection.query(quer,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on updating","error":"error","q":query});
                          }else{
                            // 5. update last activity
                            var myDate = new Date();
                            var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                            "-"+myDate.getDate()+" "+myDate.getHours()+
                            ":"+myDate.getMinutes()+":"+myDate.getSeconds();

                            connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                              if(err){
                                res.json({"message":"err.. error on update session last activity","error":"error"});
                              }else{
                                connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error on update session last activity","error":"error"});
                                  }else{
                                    res.json({"message":"success updating new value","error":"success"});
                                  }
                                });
                              }
                            });
                          }
                        });
                    }
                  }
                }
              }
            }
          }else{
            res.json({"message":"err.. no rows","query":query,"error":"invalidSession"});
          }
        }
      });
    }
  });
}

module.exports = editAccount;
