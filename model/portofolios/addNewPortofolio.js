var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function addNewPortofolio(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addNewPortofolio.prototype.handleRoutes = function(router,connection){
  router.post('/addNewPortofolio',function(req,res){
    var sessionCode = req.body.sessionCode;
    var title = req.body.title;
    var description = req.body.description;
    var imgBase64 = req.body.imgBase64;
    var timestamp = req.body.timestamp;
    if(sessionCode == null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. no params sess rec"});
    }else{
      if(title==null || title==undefined || title==''){
        res.json({"message":"err.. no params title received"});
      }else{
        if(description==null || description==undefined || description==''){
          res.json({"message":"err.. no params desc received"});
        }else{
          if(timestamp==null || timestamp==undefined || timestamp==''){
            res.json({"message":"err.. no params t_s received"});
          }else{
            //imgbase64 validation not require..
            connection.query("select session_host.id_host as id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_code='"+sessionCode+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error in selecting host from session"});
              }else{
                if(rows.length>0){
                  var idHost = rows[0].id_host;
                  var email = rows[0].email;
                  var query = "insert into `portofolio` (id_host,title,description,img_base64) values("+idHost+",'"+title+"','"+description+"','"+imgBase64+"')";
                  connection.query(query,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error in inserting new portofolio","query":query});
                    }else{
                      if(imgBase64 != null && imgBase64 != undefined && imgBase64 != ''){
                        //IMAGE NYA ADA.... UPDATE.
                          //ambil idPorto
                        connection.query("select id_portofolio from `portofolio` where id_host="+idHost+" and title='"+title+"' and description='"+description+"' and img_base64='"+imgBase64+"'",function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on selecting id porto"});
                          }else{
                            if(rows.length == 1){
                              //here
                              var idPortofolio = rows[0].id_portofolio;
                              var path = "assets/img/"+email+"/portofolios";
                              var split1 = imgbase64.split(";");
                              var split2 = split1[0].split("/");
                              var ext = split2[1];
                              var imgbase64Only = split1[1].split(",")[1];
                              mkpath.sync(path,function(err){
                                if(err){
                                  console.log("message err.. error on sync");
                                  res.json({"message":"err.. error on sync"});
                                }else{
                                  mkpath(path, function (err) {
                                    if (err) {
                                      console.log("message err.. error on mkpath");
                                      res.json({"message":"err.. error on mkpath"});
                                    }else{
                                      console.log("Directory structure "+path+" created");//debug
                                    }
                                  });
                                }
                              });
                              var decodedImage = new Buffer(imgbase64Only, 'base64');
                              var filename = 'portofolio'+idPortofolio+'.'+ext;
                              fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                                if(err){
                                  console.log("message err.. error in fs.write err:"+err);
                                  res.json({"message":"err.. error in fs.write","err":err});
                                }else{
                                  console.log("message success upload img");
                                  var imgbase64_database = "http://localhost:8080/localhost/Sidekeek-Server/"+path+"/"+filename;
                                  //res.json({"message ":" success upload img","database" : imgbase64_database});

                                  connection.query("update `portofolio` set img_base64='"+imgbase64_database+" where id_portofolio="+idPortofolio,function(err,rows){
                                    if(err){
                                      res.json({"message":"err.. error on updating host with img"});
                                    }else{
                                      connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                                        if(err){
                                          res.json({"message":"err.. error on update session last activity"});
                                        }else{
                                          res.json({"message":"success updating new value with img","error":"success"});
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }else{
                              res.json({"message":"err.. no rows on porto"});
                            }
                          }
                        });
                      }
                      //updating timestamp on session_host
                      connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating session"})
                        }else{
                          res.json({"message":"success inserting new portofolio and updating last_activity"});
                        }
                      });
                    }
                  });
                }else{
                  res.json({"message":"err.. no rows in session"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = addNewPortofolio;
