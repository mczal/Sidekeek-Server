var mysql = require('mysql');
var mkpath = require('mkpath');
function editAccount(router,pool,fs){
  var self=this;
  self.handleRoutes(router,pool,fs);
}

var self=this;

editAccount.prototype.handleRoutes = function(router,pool,fs){
  router.post('/editAccount',function(req,res){

    pool.getConnection(function(err,connection){
      if(err) {
        res.json({
          message:"err.. connection failed",
          error:"error"
        });
      } else {
        var sessionCode = connection.escape(req.body.sessionCode);
        if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
          connection.release();
          res.json({"message":"err.. no params received"});
        }else{
          var query = "select session_host.id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_code="+sessionCode;
          connection.query(query,function(err,rows){
            if(err){
              connection.release();
              res.json({"message":"err.. error in selecting sess hos","error":"error","query":query});
            }else{
              if(rows.length>0){
                var email = rows[0].email;
                var idHost = rows[0].id_host;
                // var imgbase64 = req.body.imgbase64;
                var companyName = connection.escape(req.body.companyName);
                var about = connection.escape(req.body.about);
                var handphone = connection.escape(req.body.handphone);
                var city = connection.escape(req.body.city);
                var address = connection.escape(req.body.address);
                if(companyName == null || companyName == undefined || companyName == ''){
                  connection.release();
                  res.json({"message":"err.. no params rec,.","error":"error"});
                }else{
                  if(about == null || about == undefined || about == ''){
                    connection.release();
                    res.json({"message":"err.. no params rec about","error":"error"});
                  }else{
                    if(handphone == null || handphone == undefined || handphone == ''){
                      connection.release();
                      res.json({"message":"err.. no params rec handphone","error":"error"});
                    }else{
                      if(city == null || city == undefined || city == ''){
                        connection.release();
                        res.json({"message":"err.. no params rec city","error":"error"});
                      }else{
                        if(address == null || address == undefined || address == ''){
                          connection.release();
                          res.json({"message":"err.. no params rec address","error":"error"});
                        }else{
                          // if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
                            connection.beginTransaction(function(err){
                              if (err) {
                                connection.release();
                                res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                                return;
                              }
                              var quer = "update `host` set company_name="+companyName+",about="+about+",handphone="+handphone+",location="+city+",address="+address+" where id_host ="+idHost;
                              // console.log(quer);
                              connection.query(quer,function(err,rows){
                                if(err){
                                  connection.rollback(function(){
                                    connection.release();
                                    res.json({"message":"err.. error on updating","error":"error","q":quer,"objErr":err});
                                    return;
                                  });
                                }else{
                                  // 5. update last activity
                                  var myDate = new Date();
                                  var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                  "-"+myDate.getDate()+" "+myDate.getHours()+
                                  ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                  connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode,function(err,rows){
                                    if(err){
                                      connection.rollback(function(){
                                        connection.release();
                                        res.json({"message":"err.. error on update session last activity","error":"error","objErr":err});
                                        return;
                                      });
                                    }else{
                                      connection.commit(function(err) {
                                        if (err) {
                                          connection.rollback(function() {
                                            connection.release();
                                            res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                            return;
                                          });
                                        }else{
                                          connection.release();
                                          res.json({"message":"success updating new value","error":"success"});
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            });
                        }
                      }
                    }
                  }
                }
              }else{
                connection.release();
                res.json({"message":"err.. no rows","query":query,"error":"invalidSession"});
              }
            }
          });
        }
      }
    });
  });
}

module.exports = editAccount;
