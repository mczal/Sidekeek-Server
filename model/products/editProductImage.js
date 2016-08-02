var mysql = require('mysql');
var mkpath = require('mkpath');
var fs = require('fs');

// var pictureServerPort = "8080"; //EMPTY if not neccessary
// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
function editProductImage(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

editProductImage.prototype.handleRoutes = function(router,connection,config){
  router.post('/editProductImage',function(req,res){
    var baseUrlPath = config.base_url_server_path;

    var sessionCode = req.body.sessionCode;
    var idProductImage = req.body.idProductImage;
    var timestamp = req.body.timestamp;
    var imgbase64 = req.body.imgbase64;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c received","error":"error"});
    }else{
      if(idProductImage == null || idProductImage == undefined || idProductImage == ''){
        res.json({"message":"err.. no params i_p received","error":"error"});
      }else{
        if(timestamp == null || timestamp == undefined || timestamp == ''){
          res.json({"message":"err.. no params t_s received","error":"error"});
        }else{
          if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
            res.json({"message":"err.. no params i_b_6 received","error":"error"});
          }else{
            var q1 = "select id_host from `session_host` where session_code='"+sessionCode+"'";
            connection.query(q1,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting sess","error":"error"});
              }else{
                if(rows.length>0){
                  var idHost = rows[0].id_host;
                  connection.query("select host.id_host as id_host,host.email as email from `host` join `product` on host.id_host=product.id_host join `gallery_product` on product.id_product=gallery_product.id_product where gallery_product.id="+idProductImage,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting host","error":"error"});
                    }else{
                      if(rows.length>0){
                        if(idHost = rows[0].id_host){
                          //here
                          var email = rows[0].email;
                          var path = "assets/img/"+email+"/products/product"+idProduct;
                          var split1 = imgbase64.split(";");
                          var split2 = split1[0].split("/");
                          var ext = split2[1];
                          var imgbase64Only = split1[1].split(",")[1];

                          var decodedImage = new Buffer(imgbase64Only, 'base64');
                          var filename = 'product'+idProductImage+'_'+'.'+ext;
                          fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                            if(err){
                              console.log("message err.. error in fs.write err:"+err);
                              res.json({"message":"err.. error in fs.write","err":err,"error":"error"});
                            }else{
                              console.log("message success upload img");
                              var imgbase64_database = baseUrlPath+path+"/"+filename;
                              var q10 = "update `gallery_product` set img_base64='"+imgbase64_database+"' where id="+idProductImage;
                              connection.query(q10,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error on updating","q10":q10,"error":"error"});
                                }else{
                                  //updating timestamp on session_host
                                  var myDate = new Date();
                                  var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                  "-"+myDate.getDate()+" "+myDate.getHours()+
                                  ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                  connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                                    if(err){
                                      res.json({"message":"err.. error on updating session","error":"error"})
                                    }else{
                                      res.json({"message":"success updating your productImage #"+idProductImage+" and session last activity, happy sunday","error":"success"});
                                    }
                                  });
                                }
                              });
                            }
                          });
                          //herehere
                        }else{
                          res.json({"message":"not not not authorize","error":"error"});
                        }
                      }else{
                        res.json({"message":"err no rows select host id on product","error":"error"});
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. no rows on s_c","error":"error"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = editProductImage;
