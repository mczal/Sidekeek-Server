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
    var sessionCode = req.body.sessionCode;
    var idPortofolio = req.body.idPortofolio;
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. error no params received","error":"error"});
    }else{
      if(idPortofolio==null || idPortofolio==undefined || idPortofolio==''){
        res.json({"message":"err.. no params idPorto received","error":"error"});
      }else{
        connection.query("select session_host.id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_code='"+sessionCode+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error on selecting host","error":"error"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var email = rows[0].email;
              //session host is registered with host = idHost
              //now edit portofolio
              var title = req.body.title;
              var description = req.body.description;
              var imgbase64 = req.body.imgbase64;
              var query = "update `portofolio` set title='"+title+"',description='"+description+"' where id_host="+idHost+" and id_portofolio="+idPortofolio;
              connection.query(query,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on updating value portofolio","query":query,"error":"error"});
                }else{
                  //updating timestamp on session_host
                  var myDate = new Date();
                  var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                  "-"+myDate.getDate()+" "+myDate.getHours()+
                  ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                  connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on updating session","error":"error"});
                    }else{
                      res.json({"message":"success updating your portofolio and session last activity, happy sunday","error":"success"});
                      // if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
                      //   res.json({"message":"success updating your portofolio and session last activity, happy sunday"});
                      // }else{
                      //   var path = "assets/img/"+email+"/portofolios";
                      //   var split1 = imgbase64.split(";");
                      //   var split2 = split1[0].split("/");
                      //   var ext = split2[1];
                      //   mkpath.sync(path,function(err){
                      //     if(err){
                      //       console.log("message err.. error on sync");
                      //       res.json({"message":"err.. error on sync"});
                      //     }else{
                      //       mkpath(path, function (err) {
                      //         if (err) {
                      //           console.log("message err.. error on mkpath");
                      //           res.json({"message":"err.. error on mkpath"});
                      //         }else{
                      //           console.log("Directory structure "+path+" created");//debug
                      //         }
                      //       });
                      //     }
                      //   });
                      //   var imgbase64Only = split1[1].split(",")[1];
                      //   var decodedImage = new Buffer(imgbase64Only, 'base64');
                      //   var filename = 'portofolio'+idPortofolio+'.'+ext;
                      //   fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                      //     if(err){
                      //       console.log("message err.. error in fs.write err:"+err);
                      //       res.json({"message":"err.. error in fs.write","err":err});
                      //     }else{
                      //       console.log("message success upload img");
                      //       var imgbase64_database = "http://localhost:8080/localhost/Sidekeek-Server/"+path+"/"+filename;
                      //       //res.json({"message ":" success upload img","database" : imgbase64_database});
                      //
                      //       connection.query("update `portofolio` set img_base64='"+imgbase64_database+"' where id_portofolio="+idPortofolio,function(err,rows){
                      //         if(err){
                      //           res.json({"message":"err.. error on updating host with img"});
                      //         }else{
                      //           connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                      //             if(err){
                      //               res.json({"message":"err.. error on update session last activity"});
                      //             }else{
                      //               res.json({"message":"success updating new value with img","error":"success"});
                      //             }
                      //           });
                      //         }
                      //       });
                      //     }
                      //   });
                      // }
                    }
                  });
                }
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
