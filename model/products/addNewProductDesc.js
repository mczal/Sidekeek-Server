var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function addNewProductDesc(router,connection){
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

addNewProductDesc.prototype.handleRoutes = function(router,connection){
  router.post("/addNewProductDesc",function(req,res){
    var sessionCode = req.body.sessionCode;
    var namaProduk = req.body.namaProduk;
    var harga = req.body.harga;
    var productDesc = req.body.productDesc;
    var timestamp = req.body.timestamp;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ""){
      res.json({"message":"err.. error no params sess receive","idProduct":null,"error":"error"});
    }else{
      if(namaProduk == null || namaProduk == undefined || namaProduk == ""){
        res.json({"message":"err.. error no params prdNme rec","idProduct":null,"error":"error"});
      }else{
        if(harga==null || harga==undefined || harga==""){
          res.json({"message":"err.. error no params price rec","idProduct":null,"error":"error"});
        }else{
          if(productDesc == null || productDesc == undefined || productDesc == ""){
            res.json({"message":"err.. error no params prodDesc rec","idProduct":null,"error":"error"});
          }else{
            if(timestamp==null || timestamp==undefined || timestamp==''){
              res.json({"message":"err.. no params t_s rec","idProduct":null,"error":"error"});
            }else{
              connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on selecting host from session given","idProduct":null,"error":"error"});
                  }else{
                    if(rows.length>0){
                      var idHost = rows[0].id_host;
                      var codeUnique = generateUniqueCode();
                      var qDel = "insert into `product` (id_host,product_name,product_desc,price,unique_code) values("+idHost+",'"+namaProduk+"','"+productDesc+"',"+harga+",'"+codeUnique+"')";
                      connection.query(qDel,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error inserting product","idProduct":null,"error":"error","q":qDel});
                        }else{
                          connection.query("select id_product from `product` where unique_code='"+codeUnique+"'",function(err,rows){
                            if(err){
                              res.json({"message":"err.. error in selecting idProduct","idProduct":null,"error":"error"});
                            }else{
                              if(rows.length>0){
                                var idProduct = rows[0].id_product;
                                connection.query("update `product` set unique_code=null where id_product="+idProduct , function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error in update code to null","idProduct":null,"error":"error"});
                                  }else{
                                    //updating timestamp on session_host
                                    var myDate = new Date();
                                    var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                    "-"+myDate.getDate()+" "+myDate.getHours()+
                                    ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                    // console.log(myTimestamp+" "+sessionCode);
                                    var qUpdt="update `session_host` set last_activity='"+myTimestamp+"' where session_code='"+sessionCode+"'";
                                    connection.query(qUpdt,function(err,rows){
                                      if(err){
                                        res.json({"message":"err.. error on updating session","idProduct":null,"error":"error"})
                                      }else{
                                        res.json({"message":"Success bro congrats","idProduct":idProduct,"error":"success","q":qUpdt});
                                      }
                                    });
                                  }
                                });
                              }else{
                                res.json({"message":"err.. error no rows in prodcut with given code","idProduct":null,"error":"error"});
                              }
                            }
                          });
                        }
                      });
                    }else{
                      res.json({"message":"err.. no rows on session","error":"error"});
                    }
                  }
              });
            }
          }
        }
      }
    }
  });
}

module.exports = addNewProductDesc;
