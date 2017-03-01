var fs = require('fs');
function deleteProductImage(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

deleteProductImage.prototype.handleRoutes = function(router,connection,config){
  var baseDocumentRoot = config.base_document_root;
  router.post('/deleteProductImage',function(req,res){
    var sessionCode = connection.escape(req.body.sessionCode);
    var idProductImage = connection.escape(req.body.idProductImage);
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no param s_c received"});
    }else{
      if(idProductImage == null || idProductImage == undefined || idProductImage == ''){
        res.json({"message":"err.. error no param i_p_i received"});
      }else{
        // 1. check session
        var query = "select host.id_host,host.email from `session_host` join `host` on host.id_host=session_host.id_host where session_code="+sessionCode;
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var email = rows[0].email;
              // 2. Check product validity
              var q0 = "SELECT gallery_product.img_base64,gallery_product.id as id, gallery_product.isRepresentation as isRep, product.id_product as id_product FROM `gallery_product` JOIN `product` "+
              "ON gallery_product.id_product=product.id_product WHERE "+
              "gallery_product.id="+idProductImage+" AND product.id_host="+idHost;
              connection.query(q0,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on check product availability","error":"error","q":q0});
                }else{
                  if(rows.length>0){
                    // console.log(rows[0].id);
                    var img_base64 = rows[0].img_base64;
                    var idProduct = rows[0].id_product;
                    var isRepChecker=0;
                    if(rows[0].isRep==1){
                      isRepChecker=1;
                    }
                    // 3. delete product img
                    connection.beginTransaction(function(err){
                      if (err) {
                        res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                        return;
                      }

                    });
                    var q1 = "DELETE FROM `gallery_product` where id="+idProductImage;
                    connection.query(q1,function(err,rows){
                      if(err){
                        connection.rollback(function(){
                          res.json({"message":"err.. error on delete product img","error":"error","objErr":err});
                          return;
                        });
                      }else{
                        // 4. update last activity
                        var myDate = new Date();
                        var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                        "-"+myDate.getDate()+" "+myDate.getHours()+
                        ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                        var q5 = "UPDATE `session_host` set last_activity='"+myTimestamp+
                        "' where session_code="+sessionCode;
                        connection.query(q5,function(err,rows){
                          if(err){
                            connection.rollback(function(){
                              res.json({"message":"err.. error on updating last activity","error":"error","q":q5,"objErr":err});
                              return;
                            });
                          }else{
                            if(isRepChecker==1){
                              var qUpdateLimit = "UPDATE `gallery_product` SET isRepresentation=1 WHERE id_product="+idProduct+" LIMIT 1";
                              connection.query(qUpdateLimit,function(err,rows){
                                if(err){
                                  connection.rollback(function(){
                                    res.json({"message":"err.. error updating gallery product isRep q","error":"error","q":qUpdateLimit,"objErr":err});
                                    return;
                                  });
                                }else{
                                  var splitter = img_base64.split('/');
                                  var path = baseDocumentRoot+"assets/img/"+email+"/products/product-"+idProduct+"/"+splitter[splitter.length-1];
                                  fs.unlink(path, function(err){
                                    if (err) {
                                      connection.rollback(function(){
                                        res.json({"message":"err.. error unlinking path","path":path,"error":"error","objErr":err});
                                        return;
                                      });
                                    }
                                    // HERE
                                    var qReclaim = "SELECT img_base64 FROM `gallery_product` WHERE id_product="+idProduct+" LIMIT 1";
                                    connection.query(qReclaim,function(err,rows){
                                      if(err){
                                        connection.rollback(function() {
                                          res.json({"message":"err.. error reclaim","error":"error","objErr":err});
                                          return;
                                        });
                                      }else{
                                        if(rows.length>0){
                                          var img_base64_nowRep = rows[0].img_base64;
                                          var qUpdImgRep = "UPDATE `product` SET img_rep='"+img_base64_nowRep+"' WHERE id_product="+idProduct;
                                          connection.query(qUpdImgRep,function(err){
                                            if(err){
                                              connection.rollback(function() {
                                                res.json({"message":"err.. error updating reclaim deep","error":"error","objErr":err});
                                                return;
                                              });
                                            }
                                            connection.commit(function(err) {
                                              if (err) {
                                                connection.rollback(function() {
                                                  res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                                  return;
                                                });
                                              }else{
                                                res.json({"message":"success delete product image and update isRep","error":"success"});
                                              }
                                            });

                                          });
                                        }else{
                                          connection.commit(function(err) {
                                            if (err) {
                                              connection.rollback(function() {
                                                res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                                return;
                                              });
                                            }else{
                                              res.json({"message":"success delete product image and update isRep","error":"success"});
                                            }
                                          });
                                        }
                                      }
                                    });
                                  });
                                }
                              });
                            }else{
                              var splitter = img_base64.split('/');
                              var path = baseDocumentRoot+"assets/img/"+email+"/products/product-"+idProduct+"/"+splitter[splitter.length-1];
                              fs.unlink(path, function(err){
                                if (err) {
                                  connection.rollback(function(){
                                    res.json({"message":"err.. error unlinking path","path":path,"error":"error","objErr":err});
                                    return;
                                  });
                                }
                                connection.commit(function(err) {
                                  if (err) {
                                    connection.rollback(function() {
                                      res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                      return;
                                    });
                                  }else{
                                    res.json({"message":"success delete product image","error":"success"});
                                  }
                                });
                              });
                            }
                          }
                        });
                      }
                    });
                  }else{
                    res.json({"message":"err.. product not valid","error":"error","q":q0});
                  }
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

module.exports = deleteProductImage;
