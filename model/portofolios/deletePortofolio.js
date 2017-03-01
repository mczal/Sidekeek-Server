var fs = require('fs');
function deletePortofolio(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

deletePortofolio.prototype.handleRoutes = function(router,connection,config){
  var baseDocumentRoot = config.base_document_root;
  router.post('/deletePortofolio',function(req,res){
    var sessionCode = connection.escape(req.body.sessionCode);
    var idPortofolio = connection.escape(req.body.idPortofolio);
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no param s_c received"});
    }else{
      if(idPortofolio == null || idPortofolio == undefined || idPortofolio == ''){
        res.json({"message":"err.. error no param i_p received"});
      }else{
        // 1. Checking session
        var query = "select host.id_host,email from `session_host` join `host` on host.id_host=session_host.id_host where session_code="+sessionCode+"";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var email = rows[0].email;
              // 2. Check portofolio validity
              var q0 = "SELECT id_portofolio,img_base64 FROM `portofolio` WHERE "+
              "id_portofolio="+idPortofolio+" AND id_host="+idHost;
              connection.query(q0,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on checking validity q","error":"error"});
                }else{
                  if(rows.length>0){
                    // console.log(rows[0].id_portofolio);
                    var img_base64 = rows[0].img_base64;
                    // 3. delete portofolio
                    connection.beginTransaction(function(err){
                      if (err) {
                        res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                        return;
                      }
                      var q1 = "DELETE FROM `portofolio` WHERE id_portofolio="+idPortofolio;
                      connection.query(q1,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on delete portofolio","error":"error"});
                        }else{
                          // 4. update last activity
                          var myDate = new Date();
                          var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                          "-"+myDate.getDate()+" "+myDate.getHours()+
                          ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                          var q5 = "UPDATE `session_host` set last_activity='"+myTimestamp+
                          "' where session_code="+sessionCode+"";
                          connection.query(q5,function(err,rows){
                            if(err){
                              connection.rollback(function(){
                                res.json({"message":"err.. error on updating last activity","error":"error","q":q5,"objErr":err});
                                return;
                              });
                            }else{
                              if(img_base64 != null && img_base64 != undefined && img_base64 != ''){
                                var splitter = img_base64.split('/');
                                var path = baseDocumentRoot+"assets/img/"+email+"/portofolios/"+splitter[splitter.length-1];
                                fs.unlink(path, function(err){
                                  // Need more handling than this
                                  if (err) {
                                    var queryUnlinked = "INSERT INTO `unlinked_path`(path,id_host) VALUES ('"+path+"',"+idHost+")";
                                    connection.query(queryUnlinked,function(err,rows){
                                      if(err){
                                        connection.rollback(function(){
                                          res.json({"message":"err.. error on insert unlinked path","error":"error","objErr":err});
                                          return;
                                        });
                                      }else{
                                        connection.commit(function(err) {
                                          if (err) {
                                            connection.rollback(function() {
                                              res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                              return;
                                            });
                                          }else{
                                            res.json({"message":"success deleting portofolio","error":"success"});
                                          }
                                        });
                                      }
                                    });
                                  }
                                  // console.log('successfully deleted '+path);
                                });
                              }
                              connection.commit(function(err) {
                                if (err) {
                                  connection.rollback(function() {
                                    res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                    return;
                                  });
                                }else{
                                  res.json({"message":"success deleting portofolio","error":"success"});
                                }
                              });
                            }
                          });
                        }
                      });
                    })
                  }else{
                    res.json({"message":"err.. portofolio not valid"});
                  }
                }
              });
            }else{
              res.json({"message":"err.. no rows on session","error":"invalidSession"});
            }
          }
        });
      }
    }
  });
}

module.exports = deletePortofolio;
