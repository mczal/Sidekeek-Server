var mkpath = require('mkpath');
var fs = require('fs');

// var pictureServerPort = "8080"; //EMPTY if not neccessary
// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
function editPortofolioImg(router,pool,config){
  var self=this;
  self.handleRoutes(router,pool,config);
}

editPortofolioImg.prototype.handleRoutes = function(router,pool,config){
  router.post('/editPortofolioImg',function(req,res){

    pool.getConnection(function(err,connection){
      if(err) {
        res.json({
          message:"err.. connection failed",
          error:"error"
        });
      } else {
        var baseDocumentRoot = config.base_document_root;
        var baseUrlPath = config.base_url_server_path;

        var sessionCode = connection.escape(req.body.sessionCode);
        var idPortofolio = connection.escape(req.body.idPortofolio);
        var imgbase64 = connection.escape(req.body.imgbase64);
        if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
          connection.release();
          res.json({"message":"err.. no params s_c","error":"error"});
        }else{
          if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
            connection.release();
            res.json({"message":"err.. no params i_b_64","error":"error"});
          }else{
            // check token validity
            var query = "select session_host.id_host,email from `session_host` join `host` on host.id_host=session_host.id_host where session_code="+sessionCode+"";
            connection.query(query,function(err,rows){
              if(err){
                connection.release();
                res.json({"message":"err.. error on checking sess quey","q":query});
              }else{
                if(rows.length>0){
                  var idHost = rows[0].id_host;
                  var email = rows[0].email;
                  // here
                  var path = baseDocumentRoot+"assets/img/"+email+"/portofolios";
                  var split1 = imgbase64.split(";");
                  if(split1.length <= 1){
                    connection.release();
                    res.json({"message":"err.. error imgbase64 invalid format sp1","error":"error"});
                    return;
                  }
                  var split2 = split1[0].split("/");
                  if(split2.length <= 1){
                    connection.release();
                    res.json({"message":"err.. error imgbase64 invalid format sp2","error":"error"});
                    return;
                  }
                  var ext = split2[1];
                  mkpath.sync(path,function(err){
                    if(err){
                      // console.log("message err.. error on sync");
                      // connection.rollback(function(err){
                      connection.release();
                        res.json({"message":"err.. error on sync","error":"error","objErr":err});
                      //   return;
                      // });
                    }else{
                      mkpath(path, function (err) {
                        if (err) {
                          // connection.rollback(function(err){
                          connection.release();
                            res.json({"message":"err.. error on mkpath","error":"error"});
                          //   return;
                          // });
                        }else{
                          console.log("Directory structure "+path+" created");//debug
                        }
                      });
                    }
                  });
                  var imgbase64Only = split1[1].split(",")[1];
                  var decodedImage = new Buffer(imgbase64Only, 'base64');
                  var filename = 'portofolio-'+req.body.idPortofolio+'.'+ext;
                  fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                    if(err){
                      // connection.rollback(function(err){
                      connection.release();
                        res.json({"message":"err.. error in fs.write","error":"error","objErr":err});
                      //   return;
                      // });
                    }else{
                      // console.log("message success upload img");
                      var imgbase64_database = baseUrlPath+"assets/img/"+email+"/portofolios"+"/"+filename;
                      //res.json({"message ":" success upload img","database" : imgbase64_database});
                      connection.beginTransaction(function(err){
                        if (err) {
                          connection.release();
                          res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                          return;
                        }
                        // Save existing name in db
                        connection.query("SELECT img_base64 FROM `portofolio` WHERE id_portofolio="+idPortofolio,function(err,rows){
                          if(err){
                            connection.rollback(function(){
                              connection.release();
                              res.json({"message":"err.. error on selecting oldImgbase64_databse img","error":"error","objErr":err});
                              return;
                            });
                          }else{
                            var oldImgbase64_database = rows[0].img_base64;

                            var updPorto = "update `portofolio` set img_base64='"+imgbase64_database+"' where id_portofolio="+req.body.idPortofolio;
                            connection.query(updPorto,function(err,rows){
                              if(err){
                                connection.rollback(function(){
                                  connection.release();
                                  res.json({"message":"err.. error on updating portofolio img","error":"error","updPorto":updPorto,"objErr":err});
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
                                        // Unlink old path
                                        // console.log(oldImgbase64_database);
                                        if(oldImgbase64_database){
                                          var spliter_unlinked = oldImgbase64_database.split("/");
                                          var unlinked_path = path+"/"+spliter_unlinked[spliter_unlinked.length-1];
                                          // console.log(unlinked_path);
                                          fs.unlink(unlinked_path, function(err){
                                            if(err){
                                              var queryUnlinked = "INSERT INTO `unlinked_path`(path,id_host) VALUES ('"+unlinked_path+"',"+idHost+")";
                                              connection.query(queryUnlinked,function(err,rows){
                                                if(err){
                                                  connection.rollback(function(){
                                                    connection.release();
                                                    res.json({"message":"err.. error on insert unlinked path","error":"error","queryUnlinked":queryUnlinked,"objErr":err});
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
                                                      res.json({"message":"success updating new value with img","error":"success"});
                                                    }
                                                  });
                                                }
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
                                                  res.json({"message":"success updating new value with img","error":"success"});
                                                }
                                              });
                                            }
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
                                              res.json({"message":"success updating new value with img","error":"success"});
                                            }
                                          });
                                        }
                                      }
                                    });

                                  }
                                });
                              }
                            });
                          }
                        });
                      });
                    }
                  });
                }else{
                  connection.release();
                  res.json({"message":"err.. no rows on session","error":"invalidSession"});
                }
              }
            });
          }
        }
      }
    });
  });
}

module.exports = editPortofolioImg;
