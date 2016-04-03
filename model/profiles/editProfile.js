var mysql = require('mysql');

function editProfile(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}
//see on location line 28
editProfile.prototype.handleRoutes = function(router,connection){
  router.post('/editProfile',function(req,res){
    var sessionCode = req.body.sessionCode;
    var timestamp =req.body.timestamp;
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. error no params sessionCode rec"});
    }else{
      if(timestamp==null || timestamp==undefined || timestamp==''){
        res.json({"message":"err.. error no params timestamp rec"});
      }else{
        connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error selecting host from session"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var businessCategory = req.body.businessCategory;
              var title = req.body.title;
              var companyDesc = req.body.companyDesc;
              connection.query("update `host` set category="+businessCategory+",title='"+title+"',company_desc='"+companyDesc+"' where id_host="+idHost,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on updating host"});
                }else{
                  res.json({"message":"success updating profile","error":"success"});
                }
              });
            }else{
              res.json({"message":"err.. no rows on host with given session"});
            }
          }
        });
      }
    }
  });
}

module.exports = editProfile;
