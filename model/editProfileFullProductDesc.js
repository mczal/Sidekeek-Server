var mysql = require('mysql');

function editProfileFullProductDesc(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

function generateUniqueCode(){
    var text = "";
    var possible = "[&900qnw@ml;kNI./UBI~`189`aklm3076IAKU-PASTI-BISA';l";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

editProfileFullProductDesc.prototype.handleRoutes = function(router,connection){
  router.post("/editProfileFullProductDesc",function(req,res){
    var sessionCode = req.body.sessionCode;
    var namaProduk = req.body.namaProduk;
    var harga = req.body.harga;
    var productDesc = req.body.productDesc;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ""){
      res.json({"message":"err.. error no params sess receive"});
    }else{
      if(namaProduk == null || namaProduk == undefined || namaProduk == ""){
        res.json({"message":"err.. error no params prdNme rec"});
      }else{
        if(harga==null || harga==undefined || harga==""){
          res.json({"message":"err.. error no params price rec"});
        }else{
          if(productDesc == null || productDesc == undefined || productDesc == ""){
            res.json({"message":"err.. error no params prodDesc rec"});
          }else{
            connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
                if(err){
                  res.json({"message":"err.. error on selecting host from session given"});
                }else{
                  if(rows.length>0){
                    var idHost = rows[0].id_host;
                    var codeUnique = generateUniqueCode();
                    connection.query("insert into `product` (id_host,product_name,product_desc,price,unique_code) values("+idHost+",'"+namaProduk+"','"+productDesc+"',"+harga+",'"+uniqueCode+"')",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error inserting product"});
                      }else{
                        connection.query("select id_product from `product` where unique_code='"+codeUnique+"'",function(err,rows){
                          if(err){
                            res.json({"message":"err.. error in selecting idProduct"});
                          }else{
                            if(rows.length>0){
                              var idProduct = rows[0].id_product;
                              connection.query("update `product` set unique_code=null where id_product="+idProduct , function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error in update code to null"});
                                }else{
                                  res.json({"message":"Success bro congrats","idProduct":idProduct});
                                }
                              });
                            }else{
                              res.json({"message":"err.. error no rows in prodcut with given code"});
                            }
                          }
                        });
                      }
                    });
                  }else{
                    res.json({"message":"err.. no rows on session"});
                  }
                }
            });
          }
        }
      }
    }
  });
}

module.exports = editProfileFullProductDesc;
