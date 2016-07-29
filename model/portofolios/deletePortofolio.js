function deletePortofolio(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

deletePortofolio.prototype.handleRoutes = function(router,connection){
  router.post('/deletePortofolio',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idPortofolio = req.body.idPortofolio;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no param s_c received"});
    }else{
      if(idPortofolio == null || idPortofolio == undefined || idPortofolio == ''){
        res.json({"message":"err.. error no param i_p received"});
      }else{
        // 1. Checking session
        var query = "select id_host from `session_host` where session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              // 2. Check portofolio validity
              var q0 = "SELECT id_portofolio FROM `portofolio` WHERE "+
              "id_portofolio="+idPortofolio+" AND id_host="+idHost;
              connection.query(q0,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on checking validity q","error":"error"});
                }else{
                  if(rows.length>0){
                    console.log(rows[0].id_portofolio);
                    // 3. delete portofolio
                    var q1 = "DELETE FROM `portofolio` WHERE id_portofolio="+idPortofolio;
                    connection.query(q1,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on delete portofolio","error":"error"});
                      }else{
                        // 4. update last activity
                        var myDate = new Date();
                        var myTimestamp = myDate.getFullYear()+"-"+myDate.getMonth()+
                        "-"+myDate.getDate()+" "+myDate.getHours()+
                        ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                        var q5 = "UPDATE `session_host` set last_activity='"+myTimestamp+
                        "' where session_code='"+sessionCode+"'";
                        connection.query(q5,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on updating last activity","error":"error","q":q5});
                          }else{
                            res.json({"message":"success deleting portofolio","error":"success"});
                          }
                        });
                      }
                    });
                  }else{
                    res.json({"message":"err.. portofolio not valid"});
                  }
                }
              });
            }else{
              res.json({"message":"err.. no rows on session"});
            }
          }
        });
      }
    }
  });
}

module.exports = deletePortofolio;
