var mysql = require('mysql');
var mkpath = require('mkpath');
var fs = require('fs');

// var pictureServerPort = "8080"; //EMPTY if not neccessary
// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
function editProductImage(router,pool,config){
  var self=this;
  self.handleRoutes(router,pool,config);
}

function generateUniqueCode(){
    var text = "";
    var possible = "&900qnw@mlkNIUBI~aklm3076IAKU-PASTI-BISAl";;

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

editProductImage.prototype.handleRoutes = function(router,pool,config){
  router.post('/editProductImage',function(req,res){

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
        var idProductImage = connection.escape(req.body.idProductImage);
        var imgbase64 = connection.escape(req.body.imgbase64);
        if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
          connection.release();
          res.json({"message":"err.. no params s_c received","error":"error"});
        }else{
          if(idProductImage == null || idProductImage == undefined || idProductImage == ''){
            connection.release();
            res.json({"message":"err.. no params i_p received","error":"error"});
          }else{
            if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
              connection.release();
              res.json({"message":"err.. no params i_b_6 received","error":"error"});
            }else{
              var q1 = "select id_host from `session_host` where session_code="+sessionCode;
              connection.query(q1,function(err,rows){
                if(err){
                  connection.release();
                  res.json({"message":"err.. error on selecting sess","error":"error"});
                }else{
                  if(rows.length>0){
                    var idHost = rows[0].id_host;
                    connection.query("select host.id_host as id_host,host.email as email, gallery_product.img_base64 as img_base64, product.id_product as id_product, gallery_product.isRepresentation as isRepresentation  from `host` join `product` on host.id_host=product.id_host join `gallery_product` on product.id_product=gallery_product.id_product where gallery_product.id="+idProductImage,function(err,rows){
                      if(err){
                        connection.release();
                        res.json({"message":"err.. error on selecting host","error":"error"});
                      }else{
                        if(rows.length>0){
                          if(idHost = rows[0].id_host){
                            //here
                            var email = rows[0].email;
                            var oldImgbase64_databse = rows[0].img_base64;
                            var idProduct = rows[0].id_product;
                            var isRepChecker = rows[0].isRepresentation;
                            var path = baseDocumentRoot+"assets/img/"+email+"/products/product-"+idProduct;
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
                            var imgbase64Only = split1[1].split(",")[1];

                            var decodedImage = new Buffer(imgbase64Only, 'base64');
                            var filename = 'product-'+req.body.idProductImage+'_'+generateUniqueCode()+'.'+ext;
                            fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                              if(err){
                                // console.log("message err.. error in fs.write err:"+err);
                                connection.release();
                                res.json({"message":"err.. error in fs.write","err":err,"error":"error"});
                              }else{
                                // console.log("message success upload img");
                                connection.beginTransaction(function(err){
                                  if (err) {
                                    connection.release();
                                    res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                                    return;
                                  }
                                  var imgbase64_database = baseUrlPath+"assets/img/"+email+"/products/product-"+idProduct+"/"+filename;
                                  var q10 = "update `gallery_product` set img_base64='"+imgbase64_database+"' where id="+idProductImage;
                                  connection.query(q10,function(err,rows){
                                    if(err){
                                      connection.rollback(function(){
                                        connection.release();
                                        res.json({"message":"err.. error on updating","q10":q10,"error":"error","objErr":err});
                                        return;
                                      });
                                    }else{
                                      //updating timestamp on session_host
                                      var myDate = new Date();
                                      var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                      "-"+myDate.getDate()+" "+myDate.getHours()+
                                      ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                      connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode,function(err,rows){
                                        if(err){
                                          connection.rollback(function(){
                                            connection.release();
                                            res.json({"message":"err.. error on updating session","error":"error","objErr":err});
                                            return;
                                          });
                                        }else{
                                          var splitterOldImg = oldImgbase64_databse.split("/");
                                          var deletedPath = baseDocumentRoot+"assets/img/"+email+"/products/product-"+idProduct+"/"+splitterOldImg[splitterOldImg.length-1];
                                          fs.unlink(deletedPath,function(err){
                                            if(err){
                                              connection.rollback(function(){
                                                connection.release();
                                                res.json({"message":"err.. error unlinking path","path":path,"error":"error","objErr":err});
                                                return;
                                              });
                                            }
                                            // CHECK REP
                                            if(isRepChecker == 1){
                                              var qUpdRepProd = "UPDATE `product` SET img_rep='"+imgbase64_database+"' WHERE id_product="+idProduct;
                                              connection.query(qUpdRepProd,function(err,rows){
                                                if(err){
                                                  connection.rollback(function(){
                                                    connection.release();
                                                    res.json({"message":"err.. error update img_rep on product","qUpdRepProd":qUpdRepProd,"error":"error","objErr":err});
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
                                                      res.json({"message":"success updating your productImage #"+idProductImage+" and session last activity, happy sunday","error":"success"});
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
                                                  res.json({"message":"success updating your productImage #"+idProductImage+" and session last activity, happy sunday","error":"success"});
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
                            //herehere
                          }else{
                            connection.release();
                            res.json({"message":"not not not authorize","error":"error"});
                          }
                        }else{
                          connection.release();
                          res.json({"message":"err no rows select host id on product","error":"error"});
                        }
                      }
                    });
                  }else{
                    connection.release();
                    res.json({"message":"err.. no rows on s_c","error":"invalidSession"});
                  }
                }
              });
            }
          }
        }
      }
    });
  });
}

module.exports = editProductImage;
