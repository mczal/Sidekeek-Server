var mysql = require('mysql');

function editProfile(router,pool){
  var self=this;
  self.handleRoutes(router,pool);
}
//see on location line 28
editProfile.prototype.handleRoutes = function(router,pool){
  router.post('/editProfile',function(req,res){

    pool.getConnection(function(err,connection){
      if(err) {
        res.json({
          message:"err.. connection failed",
          error:"error"
        });
      } else {
        var sessionCode = connection.escape(req.body.sessionCode);
        var tipe = connection.escape(req.body.tipe);
        var businessCategory = connection.escape(req.body.businessCategory);
        if(businessCategory==null || businessCategory==undefined || businessCategory==''){
          connection.release();
          res.json({"message":"err.. error no params rec","error":"error"});
        }else{
          if(sessionCode==null || sessionCode==undefined || sessionCode==''){
            connection.release();
            res.json({"message":"err.. error no params sessionCode rec","error":"error"});
          }else{
            if(tipe == null || tipe == undefined || tipe == ''){
              connection.release();
              res.json({"message":"err.. error no params rec","error":"error"});
            }else{
              connection.query("select id_host from `session_host` where session_code="+sessionCode,function(err,rows){
                if(err){
                  connection.release();
                  res.json({"message":"err.. error selecting host from session"});
                }else{
                  if(rows.length>0){
                    var idHost = rows[0].id_host;
                    var title = connection.escape(req.body.title);
                    var companyDesc = connection.escape(req.body.companyDesc);
                    connection.beginTransaction(function(err){
                      if (err) {
                        connection.release();
                        res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                        return;
                      }
                      connection.query("update `host` set id_tipe="+tipe+",category="+businessCategory+",title="+title+",company_desc="+companyDesc+" where id_host="+idHost,function(err,rows){
                        if(err){
                          connection.rollback(function(){
                            connection.release();
                            res.json({"message":"err.. error on updating host","error":"error","objErr":err});
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
                                  res.json({"message":"success updating profile","error":"success"});
                                }
                              });
                            }
                          });
                        }
                      });
                    });
                  }else{
                    connection.release();
                    res.json({"message":"err.. no rows on host with given session","error":"invalidSession"});
                  }
                }
              });
            }
          }
        }
      }
    });
  });
}

module.exports = editProfile;
