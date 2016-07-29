function deleteProductImage(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

deleteProductImage.prototype.handleRoutes = function(router,connection){
  router.post('/deleteProductImage',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProductImage = req.body.idProductImage;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no param s_c received"});
    }else{
      if(idProductImage == null || idProductImage == undefined || idProductImage == ''){
        res.json({"message":"err.. error no param i_p_i received"});
      }else{
        // 1. check session
        var query = "select id_host from `session_host` where session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              // 2. Check product validity
              var q0 = "SELECT gallery_product.id as id FROM `gallery_product` JOIN `product` "+
              "ON gallery_product.id_product=product.idProduct WHERE "+
              "gallery_product.id="+idProductImage+" AND product.id_host="+idHost;
              connection.query(q0,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on check product availability","error":"error","q":q0});
                }else{
                  if(rows.length>0){
                    console.log(rows[0].id);
                    // 3. delete product img
                    var q1 = "DELETE FROM `gallery_product` where id="+idProductImage;
                    connection.query(q1,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on delete product img","error":"error"});
                      }else{
                        // 4. update last activity
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
                            res.json({"message":"success delete product image","error":"success"});
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
              res.json({"message":"err.. no rows on session"});
            }
          }
        });
      }
    }
  });
}

module.exports = deleteProductImage;
