var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function editProductDesc(router,pool){
  var self=this;
  self.handleRoutes(router,pool);
}

var self=this;

editProductDesc.prototype.handleRoutes = function(router,pool){
  router.post('/editProductDesc',function(req,res){
    pool.getConnection(function(err,connection){
      if(err) {
        res.json({
          message:"err.. connection failed",
          error:"error"
        });
      } else {
        var sessionCode = connection.escape(req.body.sessionCode);
        var idProduct = connection.escape(req.body.idProduct);
        if(sessionCode==null || sessionCode==undefined || sessionCode==''){
          connection.release();
          res.json({"message":"err.. no params rec","error":"error"});
        }else{
          if(idProduct==null || idProduct==undefined || idProduct==''){
            connection.release();
            res.json({"message":"err.. no params rec","error":"error"});
          }else{
            connection.query("select id_host from `session_host` where session_code="+sessionCode,function(err,rows){
              if(err){
                connection.release();
                res.json({"message":"err.. error on selecting host","error":"error"});
              }else{
                if(rows.length>0){
                  var idHost = rows[0].id_host;
                  var namaProduk = connection.escape(req.body.namaProduk);
                  var harga = connection.escape(req.body.harga);
                  var productDesc = connection.escape(req.body.productDesc);
                  connection.beginTransaction(function(err){
                    if (err) {
                      connection.release();
                      res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                      return;
                    }
                    var query = "update `product` set product_name="+namaProduk+",product_desc="+productDesc+",price="+harga+" where id_host="+idHost+" and id_product="+idProduct;
                    connection.query(query,function(err,rows){
                      if(err){
                        connection.rollback(function(){
                          connection.release();
                          res.json({"message":"err.. error on updating","query":query,"error":"error","objErr":err});
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
                            connection.commit(function(err) {
                              if (err) {
                                connection.rollback(function() {
                                  connection.release();
                                  res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                  return;
                                });
                              }else{
                                connection.release();
                                res.json({"message":"success updating your product and session last activity, happy sunday","error":"success"});
                              }
                            });
                          }
                        });
                      }
                    });
                  });
                }else{
                  connection.release();
                  res.json({"message":"err.. no session registered","error":"invalidSession"});
                }
              }
            });
          }
        }
      }
    });
  });
}

module.exports = editProductDesc;
