var mysql = require('mysql');

function editProfile(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}
//see on location line 28
editProfile.prototype.handleRoutes = function(router,connection){
  router.post('/editProfile',function(req,res){
    var sessionCode = req.body.sessionCode;
    var tipe = req.body.tipe;
    var businessCategory = req.body.businessCategory;
    if(businessCategory==null || businessCategory==undefined || businessCategory==''){
      res.json({"message":"err.. error no params rec","error":"error"});
    }else{
      if(sessionCode==null || sessionCode==undefined || sessionCode==''){
        res.json({"message":"err.. error no params sessionCode rec","error":"error"});
      }else{
        if(tipe == null || tipe == undefined || tipe == ''){
          res.json({"message":"err.. error no params rec","error":"error"});
        }else{
          connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error selecting host from session"});
            }else{
              if(rows.length>0){
                var idHost = rows[0].id_host;
                var title = req.body.title;
                var companyDesc = req.body.companyDesc;
                connection.query("update `host` set id_tipe="+tipe+",category="+businessCategory+",title='"+title+"',company_desc='"+companyDesc+"' where id_host="+idHost,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on updating host","error":"error"});
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
                        res.json({"message":"success updating profile","error":"success"});
                      }
                    });
                  }
                });
              }else{
                res.json({"message":"err.. no rows on host with given session"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = editProfile;
