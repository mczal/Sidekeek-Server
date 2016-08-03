var mysql = require('mysql');
var fs = require('fs');
var mkpath = require('mkpath');

// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
// var pictureServerPort = "8080"; //EMPTY if not neccessary
function editAccountPic(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

editAccountPic.prototype.handleRoutes = function(router,connection,config){
  router.post('/editAccountPic',function(req,res){
    var baseUrlPath = config.base_url_server_path;

    var sessionCode = req.body.sessionCode;
    var imgbase64 = req.body.imgbase64;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param s_c rec","error":"error"});
    }else{
      if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
        res.json({"message":"err.. no param i_b_64 rec","error":"error"});
      }else{
        var q1 = "select session_host.id_host as id_host,host.email as email from `session_host` join `host` on session_host.id_host=host.id_host where session_host.session_code = '"+sessionCode+"'";
        connection.query(q1,function(err,rows){
          if(err){
            res.json({"message":"err.. error on q1","error":"error"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var email = rows[0].email;
              //IMGBASE64 AFFAIR

              //gambarnya aadaa!!
              //IMGBASE64 Affair
              var path = "assets/img/"+email;
              var split1 = imgbase64.split(";");
              var split2 = split1[0].split("/");
              var ext = split2[1];
              var imgbase64Only = split1[1].split(",")[1];
              mkpath.sync(path,function(err){
                if(err){
                  console.log("message err.. error on sync");
                  res.json({"message":"err.. error on sync","error":"error"});
                }else{
                  mkpath(path, function (err) {
                    if (err) {
                      console.log("message err.. error on mkpath");
                      res.json({"message":"err.. error on mkpath","error":"error"});
                    }else{
                      console.log("Directory structure "+path+" created");//debug
                    }
                  });
                }
              });
              var decodedImage = new Buffer(imgbase64Only, 'base64');
              var filename = 'accountPicture.'+ext;
              fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                if(err){
                  console.log("message err.. error in fs.write err:"+err);
                  res.json({"message":"err.. error in fs.write","err":err,"error":"error"});
                }else{
                  console.log("message success upload img");
                  var imgbase64_database = baseUrlPath+path+"/"+filename;
                  //res.json({"message ":" success upload img","database" : imgbase64_database});
                  connection.query("update `host` set img_base64='"+imgbase64_database+"' where id_host ="+idHost,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on updating host with img","error":"error"});
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
                          res.json({"message":"success updating new value with img","error":"success"});
                        }
                      });
                    }
                  });
                }
              });
              //END OF IMGBASE64
            }else{
              res.json({"message":"err.. error no rows on session"});
            }
          }
        });
      }
    }
  });
}

module.exports = editAccountPic;
