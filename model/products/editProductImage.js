var mysql = require('mysql');

function editProductImage(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

editProductImage.prototype.handleRoutes = function(router,connection){
  router.post('/editProductImage',function(err,rows){
    var sessionCode = req.body.sessionCode;
    var idProductImage = req.body.idProductImage;
    var timestamp = req.body.timestamp;
    var imgbase64 = req.body.imgbase64;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c received"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no params i_p received"});
      }else{
        if(timestamp == null || timestamp == undefined || timestamp == ''){
          res.json({"message":"err.. no params t_s received"});
        }else{
          if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
            res.json({"message":"err.. no params i_b_6 received"});
          }else{
            var q1 = "select id_host from `session_host` where session_code='"+sessionCode+"'";
            connection.query(q1,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting sess"});
              }else{
                if(rows.length>0){
                  var idHost = rows[0].id_host;
                  connection.query("select host.id_host as id_host from `host` join `product` on host.id_host=product.id_host join `gallery_product` on product.id_product=gallery_product.id_product where gallery_product.id="+idProductImage,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting host"});
                    }else{
                      if(rows.length>0){
                        if(idHost = rows[0].id_host){
                          //here
                          var path = "assets/img/"+email+"/products";
                          var split1 = imgbase64.split(";");
                          var split2 = split1[0].split("/");
                          var ext = split2[1];
                          var imgbase64Only = split1[1].split(",")[1];

                          var decodedImage = new Buffer(imgbase64Only, 'base64');
                          var filename = 'product'+idProduct+'_'+generateUniqueCode()+'.'+ext;
                          fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                            if(err){
                              console.log("message err.. error in fs.write err:"+err);
                              res.json({"message":"err.. error in fs.write","err":err});
                            }else{
                              console.log("message success upload img");
                              var imgbase64_database = "http://localhost:8080/localhost/Sidekeek-Server/"+path+"/"+filename;
                              connection.query("update ``",function(err,rows){
                                
                              });
                            }
                          //herehere
                        }else{
                          res.json({"message":"not not not authorize"});
                        }
                      }else{
                        res.json({"message":"err no rows select host id on product"});
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. no rows on s_c"});
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
