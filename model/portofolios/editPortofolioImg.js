var mkpath = require('mkpath');
var fs = require('fs');

// var pictureServerPort = "8080"; //EMPTY if not neccessary
// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
function editPortofolioImg(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

editPortofolioImg.prototype.handleRoutes = function(router,connection,config){
  router.post('/editPortofolioImg',function(req,res){
    var baseUrlPath = config.base_url_server_path;

    var sessionCode = req.body.sessionCode;
    var idPortofolio = req.body.idPortofolio;
    var imgbase64 = req.body.imgbase64;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c","error":"error"});
    }else{
      if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
        res.json({"message":"err.. no params i_b_64","error":"error"});
      }else{
        // check token validity
        var query = "select id_host from `session_host` where session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              // here
              var path = "assets/img/"+email+"/portofolios";
              var split1 = imgbase64.split(";");
              var split2 = split1[0].split("/");
              var ext = split2[1];
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
              var imgbase64Only = split1[1].split(",")[1];
              var decodedImage = new Buffer(imgbase64Only, 'base64');
              var filename = 'portofolio'+idPortofolio+'.'+ext;
              fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                if(err){
                  console.log("message err.. error in fs.write err:"+err);
                  res.json({"message":"err.. error in fs.write","err":err,"error":"error"});
                }else{
                  console.log("message success upload img");
                  var imgbase64_database = baseUrlPath+path+"/"+filename;
                  //res.json({"message ":" success upload img","database" : imgbase64_database});

                  connection.query("update `portofolio` set img_base64='"+imgbase64_database+"' where id_portofolio="+idPortofolio,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on updating host with img","error":"error"});
                    }else{
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
            }else{
              res.json({"message":"err.. no rows on session","error":"invalidSession"});
            }
          }
        });
      }
    }
  });
}

module.exports = editPortofolioImg;
