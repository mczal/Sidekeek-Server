var mysql = require('mysql');
var mkpath = require('mkpath');
var fs = require('fs');

//TESTED 27 FEBRUARI 2016
function editPortofolio(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
//jadi setiap yang mau edit portofolio harus ngasih session code host nya dan "id portofolionya"(rethink) cuy
editPortofolio.prototype.handleRoutes = function(router,connection){
  router.post('/editPortofolio',function(req,res){
    var sessionCode = connection.escape(req.body.sessionCode);
    var idPortofolio = connection.escape(req.body.idPortofolio);
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. error no params received","error":"error"});
    }else{
      if(idPortofolio==null || idPortofolio==undefined || idPortofolio==''){
        res.json({"message":"err.. no params idPorto received","error":"error"});
      }else{
        connection.query("select session_host.id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_code="+sessionCode,function(err,rows){
          if(err){
            res.json({"message":"err.. error on selecting host","error":"error"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var email = rows[0].email;
              //session host is registered with host = idHost
              //now edit portofolio
              connection.beginTransaction(function(err){
                if (err) {
                  res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                  return;
                }
                var title = connection.escape(req.body.title);
                var description = connection.escape(req.body.description);
                var query = "update `portofolio` set title="+title+",description="+description+" where id_host="+idHost+" and id_portofolio="+idPortofolio;
                connection.query(query,function(err,rows){
                  if(err){
                    connection.rollback(function(){
                      res.json({"message":"err.. error on updating value portofolio","error":"error","query":query,"objErr":err});
                      return;
                    });
                  }else{
                    //updating timestamp on session_host
                    var myDate = new Date();
                    var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                    "-"+myDate.getDate()+" "+myDate.getHours()+
                    ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                    connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode,function(err,rows){
                      if(err){
                        connection.rollback(function(){
                          res.json({"message":"err.. error on updating session","error":"error","objErr":err});
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
                            res.json({"message":"success updating your portofolio and session last activity, happy sunday","error":"success"});
                          }
                        });
                      }
                    });
                  }
                });
              });
            }else{
              res.json({"message":"err.. no session registered","error":"invalidSession"});
            }
          }
        });
      }
    }
  });
}

module.exports = editPortofolio;
