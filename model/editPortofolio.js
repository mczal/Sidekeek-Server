var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function editPortofolio(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;
//jadi setiap yang mau edit portofolio harus ngasih session code host nya dan "id portofolionya"(rethink) cuy
editPortofolio.prototype.handleRoutes = function(router,connection){
  router.post('/editPortofolio',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idPortofolio = req.body.idPortofolio;
    var timestamp = req.body.timestamp;
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. error no params received"});
    }else{
      if(timestamp==null || timestamp==undefined || timestamp==''){
        res.json({"message":"err.. no params t_s received"});
      }else{
        if(idPortofolio==null || idPortofolio==undefined || idPortofolio==''){
          res.json({"message":"err.. no params idPorto received"});
        }else{
          connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on selecting host"});
            }else{
              if(rows.length>0){
                var idHost = rows[0].id_host;
                //session host is registered with host = idHost
                //now edit portofolio
                var title = req.body.title;
                var description = req.body.description;
                var imgBase64 = req.body.imgBase64;
                var query = "update `portofolio` set title='"+title+"',description='"+description+"',img_base64='"+imgBase64+"' where id_host="+idHost+" and id_portofolio="+idPortofolio;
                connection.query(query,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on updating value portofolio","query":query});
                  }else{
                    //updating timestamp on session_host
                    connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on updating session"})
                      }else{
                        res.json({"message":"success updating your portofolio and session last activity, happy sunday"});
                      }
                    });
                  }
                });
              }else{
                res.json({"message":"err.. no session registered"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = editPortofolio;
