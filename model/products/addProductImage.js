var mysql = require('mysql');

function generateUniqueCode(){
    var text = "";
    var possible = "[&900qnw@ml;kNI./UBI~`189`aklm3076IAKU-PASTI-BISA';l";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function addProductImage(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addProductImage.prototype.handleRoutes = function(router,connection){
  router.post("/addProductImage",function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    var imgbase64 = req.body.imgBase64;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no paramsreceived..,"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no params received,.,"});
      }else{
        if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
          res.json({"message":"err.. no paramsreceived..,"});
        }else{
          /*TODO: step 1. get email nya untuk path folder (yang digunakan di path folder=email & idproduct)
          *       step 2. bikin path , dir , dll (kebutuhan save file)
          */

            //step 1.
          connection.query("select host.email as email,session_host.id_host as id_host from `session_host` join `host` on session_host.id_host=host.id_host where session_host.session_code='"+sessionCode+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on selecting host","error":"error"});
            }else{
              if(rows.length>0){
                var email = rows[0].email;
                var idHost = rows[0].id_host;
            //step 2.
                var path = "assets/img/"+email+"/products";
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
                var filename = 'product'+idProduct+'_'+generateUniqueCode()+'.'+ext;
                fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                  if(err){
                    console.log("message err.. error in fs.write err:"+err);
                    res.json({"message":"err.. error in fs.write","err":err});
                  }else{
                    console.log("message success upload img");
                    var imgbase64_database = "http://localhost:8080/localhost/Sidekeek-Server/"+path+"/"+filename;
                    //res.json({"message ":" success upload img","database" : imgbase64_database});
                    var q1 = "insert into `gallery_product`(id_product,img_base64) values("+idProduct+",'"+imgbase64_database+"') ";
                    connection.query(q1,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on updating host with img"});
                      }else{
                        var q2 = "update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'";
                        connection.query(q2,function(err,rows){
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
                res.json({"message":"err... no rows","error":"error"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = addProductImage;
