function deleteProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

deleteProduct.prototype.handleRoutes = function(router,connection){
  router.post('/deleteProduct',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no param s_c rec","error":"error"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. error no param s_c rec","error":"error"});
      }else{
        // 1. Check sessioncode
        var query = "select id_host from `session_host` where session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              // 2. Check product validity
              var q0 = "SELECT id_product FROM `product` where id_product="+idProduct+" AND id_host="+idHost;
              connection.query(q0,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on check product validity q","error":"error"});
                }else{
                  if(rows.length>0){
                    console.log(rows[0].id_product);
                    // idProduct = rows[0].id_product;
                    // 3. Delete dependencies
                    var q1 = "delete from `gallery_product` where id_product="+idProduct;
                    connection.query(q1,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on deleting dependencies","error":"error"});
                      }else{
                        // 4. Delete product
                        var q2 = "delete from `product` where id_product="+idProduct;
                        connection.query(q2,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on deleting product","error":"error"});
                          }else{
                            // 5. update last activity
                            var myDate = new Date();
                            var myTimestamp = myDate.getFullYear()+"-"+myDate.getMonth()+
                            "-"+myDate.getDate()+" "+myDate.getHours()+
                            ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                            var q5 = "UPDATE `session_host` set last_activity='"+myTimestamp+
                            "' where session_code='"+sessionCode+"'";
                            connection.query(q5,function(err,rows){
                              if(err){
                                res.json({"message":"err.. error on updating last activity","error":"error","q":q5});
                              }else{
                                res.json({"message":"success delete product","error":"success"});
                              }
                            });
                          }
                        });
                      }
                    });
                  }else{
                    res.json({"message":"err.. product not valid","error":"error"});
                  }
                }
              });
            }else{
              res.json({"message":"err.. no rows on session"});
            }
          }
        });

      }
    }
  });
}

module.exports = deleteProduct;
