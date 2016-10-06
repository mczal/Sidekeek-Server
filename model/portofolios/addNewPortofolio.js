var mysql = require('mysql');
var mkpath = require('mkpath');
var fs = require('fs');
//TESTED 27 FEBRUARI 2016

// var pictureServerPort = "8080"; //EMPTY if not neccessary
// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
function addNewPortofolio(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

var self=this;

addNewPortofolio.prototype.handleRoutes = function(router,connection,config){
  router.post('/addNewPortofolio',function(req,res){
    var baseUrlPath = config.base_url_server_path;
    // console.log(baseUrlPath);

    var sessionCode = connection.escape(req.body.sessionCode);
    var title = connection.escape(req.body.title);
    var description = connection.escape(req.body.description);
    var imgBase64 = connection.escape(req.body.imgbase64);
    if(sessionCode == null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. no params sess rec","error":"error"});
    }else{
      if(title==null || title==undefined || title==''){
        res.json({"message":"err.. no params title received","error":"error"});
      }else{
        if(description==null || description==undefined || description==''){
          res.json({"message":"err.. no params desc received","error":"error"});
        }else{
          var qSelectSes = "select session_host.id_host as id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_code="+sessionCode+"";
          connection.query(qSelectSes,function(err,rows){
            if(err){
              res.json({"message":"err.. error in selecting host from session","error":"error","qSelectSes":qSelectSes});
            }else{
              if(rows.length>0){
                var idHost = rows[0].id_host;
                var email = rows[0].email;

                var qMax = "select count(id_portofolio) as count from `portofolio` where id_host="+idHost;
                connection.query(qMax,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on count portofolio","error":"error"});
                  }else{
                    var count = rows[0].count;
                    if(count < 12){
                      connection.beginTransaction(function(err){
                        if (err) {
                          res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                          return;
                        }
                        var query = "insert into `portofolio` (id_host,title,description) values("+idHost+","+title+","+description+")";
                        connection.query(query,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error in inserting new portofolio","query":query,"error":"error"});
                          }else{
                            if(imgBase64 != null && imgBase64 != undefined && imgBase64 != ''){
                              //IMAGE NYA ADA.... UPDATE.
                                //ambil idPorto
                              // console.log("INI ID NYA NE: ",rows.insertId);
                              // connection.query("select id_portofolio from `portofolio` where id_host="+idHost+" and title="+title+" and description="+description,function(err,rows){
                                // if(err){
                                //   res.json({"message":"err.. error on selecting id porto","error":"error"});
                                // }else{
                                  // if(rows.length == 1){
                                    //here
                                    var idPortofolio = rows.insertId;
                                    var path = "assets/img/"+email+"/portofolios";
                                    var split1 = req.body.imgbase64.split(";");
                                    if(split1.length <= 1){
                                      res.json({"message":"err.. error imgbase64 invalid format sp1","error":"error"});
                                      return;
                                    }
                                    var split2 = split1[0].split("/");
                                    if(split2.length <= 1){
                                      res.json({"message":"err.. error imgbase64 invalid format sp2","error":"error"});
                                      return;
                                    }
                                    var ext = split2[1];
                                    var imgbase64Only = split1[1].split(",")[1];
                                    mkpath.sync(path,function(err){
                                      if(err){
                                        // console.log("message err.. error on sync");
                                        connection.rollback(function(){
                                          res.json({"message":"err.. error on sync","error":"error","objErr":err});
                                          return;
                                        });
                                      }else{
                                        mkpath(path, function (err) {
                                          if (err) {
                                            // console.log("message err.. error on mkpath");
                                            connection.rollback(function(){
                                              res.json({"message":"err.. error on mkpath","error":"error","objErr":err});
                                              return;
                                            });
                                          }else{
                                            console.log("Directory structure "+path+" created");//debug
                                          }
                                        });
                                      }
                                    });
                                    var decodedImage = new Buffer(imgbase64Only, 'base64');
                                    var filename = 'portofolio-'+idPortofolio+'.'+ext;
                                    fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                                      if(err){
                                        // console.log("message err.. error in fs.write err:"+err);
                                        connection.rollback(function(){
                                          res.json({"message":"err.. error in fs.write","error":"error","objErr":err});
                                          return;
                                        });
                                      }else{
                                        // console.log("message success upload img");
                                        var imgbase64_database = baseUrlPath+path+"/"+filename;
                                        //res.json({"message ":" success upload img","database" : imgbase64_database});
                                        // console.log(imgbase64_database);
                                        connection.query("update `portofolio` set img_base64='"+imgbase64_database+"' where id_portofolio="+idPortofolio,function(err,rows){
                                          if(err){
                                            connection.rollback(function(){
                                              res.json({"message":"err.. error on updating host with img","error":"error","objErr":err});
                                              return;
                                            });
                                          }else{
                                            var myDate = new Date();
                                            var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                            "-"+myDate.getDate()+" "+myDate.getHours()+
                                            ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                            connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode+"",function(err,rows){
                                              if(err){
                                                connection.rollback(function(){
                                                  res.json({"message":"err.. error on update session last activity","error":"error","objErr":err});
                                                  return;
                                                });
                                              }else{
                                                // SUCCEED
                                                connection.commit(function(err) {
                                                  if (err) {
                                                    connection.rollback(function() {
                                                      res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                                      return;
                                                    });
                                                  }else{
                                                    res.json({"message":"success inserting new portofolio and updating last_activity","error":"success"});
                                                  }
                                                });
                                              }
                                            });
                                          }
                                        });
                                      }
                                    });
                                  // }else{
                                  //   connection.rollback(function(err){
                                  //     res.json({"message":"err.. no rows on porto","error":"error","objErr":err});
                                  //     return;
                                  //   });
                                  // }
                                // }
                              // });
                            }else{
                              //updating timestamp on session_host
                              connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code="+sessionCode+"",function(err,rows){
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
                                      res.json({"message":"success inserting new portofolio and updating last_activity","error":"success"});
                                    }
                                  });
                                }
                              });
                            }
                          }
                        });
                      });
                      // here
                    }else{
                      res.json({"error":"error","message":"maximum limit portofolio exceeded","idProduct":null,"sign":12});
                    }
                  }
                })
                // HERE UP VALIDATION MAXIMUM 12 Portofolio
              }else{
                res.json({"message":"err.. no rows in session","error":"invalidSession"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = addNewPortofolio;
