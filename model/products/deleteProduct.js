var fs = require('fs');
var pathz = require('path');
// var rimraf = require('rimraf');

function deleteProduct(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

deleteProduct.prototype.handleRoutes = function(router,connection,config){
  var baseDocumentRoot = config.base_document_root;
  router.post('/deleteProduct',function(req,res){
    var sessionCode = connection.escape(req.body.sessionCode);
    var idProduct = connection.escape(req.body.idProduct);
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. error no param s_c rec","error":"error"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. error no param s_c rec","error":"error"});
      }else{
        // 1. Check sessioncode
        var query = "select host.id_host,host.email from `session_host` join `host` on session_host.id_host=host.id_host where session_code="+sessionCode+"";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on checking sess quey","q":query});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var email = rows[0].email;
              // 2. Check product validity
              var q0 = "SELECT id_product FROM `product` where id_product="+idProduct+" AND id_host="+idHost;
              connection.query(q0,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on check product validity q","error":"error"});
                }else{
                  if(rows.length>0){
                    // console.log(rows[0].id_product);
                    // idProduct = rows[0].id_product;
                    // 3. Delete dependencies
                    connection.beginTransaction(function(err){
                      if (err) {
                        res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                        return;
                      }
                      var q1 = "delete from `gallery_product` where id_product="+idProduct;
                      connection.query(q1,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on deleting dependencies","error":"error"});
                        }else{
                          // 4. Delete product
                          var q2 = "delete from `product` where id_product="+idProduct;
                          connection.query(q2,function(err,rows){
                            if(err){
                              connection.rollback(function(){
                                res.json({"message":"err.. error on deleting product","error":"error","objErr":err});
                                return;
                              });
                            }else{
                              // 5. update last activity
                              var myDate = new Date();
                              var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                              "-"+myDate.getDate()+" "+myDate.getHours()+
                              ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                              var q5 = "UPDATE `session_host` set last_activity='"+myTimestamp+
                              "' where session_code="+sessionCode+"";
                              connection.query(q5,function(err,rows){
                                if(err){
                                  connection.rollback(function(){
                                    res.json({"message":"err.. error on updating last activity","error":"error","q":q5,"objErr":err});
                                    return;
                                  });
                                }else{
                                  //Delete resources
                                  var path = baseDocumentRoot+"assets/img/"+email+"/products/product-"+req.body.idProduct;
                                  var rmdir = function(dir) {
                                  	var list = fs.readdirSync(dir);
                                  	for(var i = 0; i < list.length; i++) {

                                  		var filename = pathz.join(dir, list[i]);
                                      // console.log(filename);
                                  		var stat = fs.statSync(filename);
                                  		if(filename == "." || filename == "..") {
                                  			// pass these files
                                  		} else if(stat.isDirectory()) {
                                  			// rmdir recursively
                                  			rmdir(filename);
                                  		} else {
                                  			// rm fiilename
                                  			fs.unlinkSync(filename);
                                  		}
                                  	}
                                  	fs.rmdirSync(dir);
                                  };
                                  rmdir(path);
                                  connection.commit(function(err) {
                                    if (err) {
                                      connection.rollback(function() {
                                        res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                        return;
                                      });
                                    }else{
                                      res.json({"message":"success delete product","error":"success"});
                                    }
                                  });
                                  // fs.rmdir(path, function(err){
                                  //   if(err){
                                  //     connection.rollback(function() {
                                  //       res.json({"message":"err.. error rmdir","error":"error","objErr":err});
                                  //       return;
                                  //     });
                                  //   }else{
                                  //     connection.commit(function(err) {
                                  //       if (err) {
                                  //         connection.rollback(function() {
                                  //           res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                  //           return;
                                  //         });
                                  //       }else{
                                  //         res.json({"message":"success delete product","error":"success"});
                                  //       }
                                  //     });
                                  //   }
                                  // });
                                  // console.log(deleteFolderRecursive);

                                }
                              });
                            }
                          });
                        }
                      });
                    });
                  }else{
                    res.json({"message":"err.. product not valid","error":"error"});
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

module.exports = deleteProduct;
