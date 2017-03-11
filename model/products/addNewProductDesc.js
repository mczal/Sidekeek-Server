var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function addNewProductDesc(router,pool){
  var self=this;
  self.handleRoutes(router,pool);
}

var self=this;

addNewProductDesc.prototype.handleRoutes = function(router,pool){
  router.post("/addNewProductDesc",function(req,res){

    pool.getConnection(function(err,connection){
        if(err) {
          res.json({
            message:"err.. connection failed",
            error:"error"
          });
        } else {
          var sessionCode = connection.escape(req.body.sessionCode);
          var namaProduk = connection.escape(req.body.namaProduk);
          var harga = connection.escape(req.body.harga);
          var productDesc = connection.escape(req.body.productDesc);
          if(sessionCode == null || sessionCode == undefined || sessionCode == ""){
            connection.release();
            res.json({"message":"err.. error no params sess receive","idProduct":null,"error":"error"});
          }else{
            if(namaProduk == null || namaProduk == undefined || namaProduk == ""){
              connection.release();
              res.json({"message":"err.. error no params prdNme rec","idProduct":null,"error":"error"});
            }else{
              if(harga==null || harga==undefined || harga==""){
                connection.release();
                res.json({"message":"err.. error no params price rec","idProduct":null,"error":"error"});
              }else{
                if(productDesc == null || productDesc == undefined || productDesc == ""){
                  connection.release();
                  res.json({"message":"err.. error no params prodDesc rec","idProduct":null,"error":"error"});
                }else{
                  connection.query("select id_host from `session_host` where session_code="+sessionCode+"",function(err,rows){
                      if(err){
                        connection.release();
                        res.json({"message":"err.. error on selecting host from session given","idProduct":null,"error":"error"});
                      }else{
                        if(rows.length>0){
                          var idHost = rows[0].id_host;
                          // HERE MAX PRODUCT 6 BIJI
                          var qMax = "select count(id_product) as count from `product` where id_host="+idHost;
                          connection.query(qMax,function(err,rows){
                            if(err){
                              connection.release();
                              res.json({"error":"error","message":"err.. error on count product","idProduct":null});
                            }else{
                              var count = rows[0].count;
                              if(count < 6){
                                // var codeUnique = generateUniqueCode();
                                connection.beginTransaction(function(err){
                                  if (err) {
                                    connection.release();
                                    res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                                    return;
                                  }
                                  var qDel = "insert into `product` (id_host,product_name,product_desc,price) values("+idHost+","+namaProduk+","+productDesc+","+harga+")";
                                  connection.query(qDel,function(err,rows){
                                    if(err){
                                      connection.rollback(function(){
                                        connection.release();
                                        res.json({"message":"err.. error inserting product","idProduct":null,"error":"error","q":qDel,"objErr":err});
                                        return;
                                      });
                                    }else{
                                      // connection.query("select id_product from `product` where unique_code='"+codeUnique+"'",function(err,rows){
                                        // if(err){
                                        //   res.json({"message":"err.. error in selecting idProduct","idProduct":null,"error":"error"});
                                        // }else{
                                          // if(rows.length>0){
                                            var idProduct = rows.insertId;
                                            // connection.query("update `product` set unique_code=null where id_product="+idProduct , function(err,rows){
                                              // if(err){
                                              //   res.json({"message":"err.. error in update code to null","idProduct":null,"error":"error"});
                                              // }else{
                                                //updating timestamp on session_host
                                                var myDate = new Date();
                                                var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                                "-"+myDate.getDate()+" "+myDate.getHours()+
                                                ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                                // console.log(myTimestamp+" "+sessionCode);
                                                var qUpdt="update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode;
                                                connection.query(qUpdt,function(err,rows){
                                                  if(err){
                                                    connection.rollback(function(){
                                                      connection.release();
                                                      res.json({"message":"err.. error on updating session","idProduct":null,"error":"error","objErr":err});
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
                                                        res.json({"message":"Success bro congrats","idProduct":idProduct,"error":"success"});
                                                      }
                                                    });
                                                  }
                                                });
                                              // }
                                            // });
                                          // }else{
                                          //   res.json({"message":"err.. error no rows in prodcut with given code","idProduct":null,"error":"error"});
                                          // }
                                        // }
                                      // });
                                    }
                                  });
                                });
                              }else{
                                connection.release();
                                res.json({"error":"error","message":"maximum limit product exceeded","idProduct":null,"sign":6});
                              }
                            }
                          })
                        }else{
                          connection.release();
                          res.json({"message":"err.. no rows on session","error":"invalidSession"});
                        }
                      }
                  });
                }
              }
            }
          }
        }
    });
  });
}

module.exports = addNewProductDesc;
