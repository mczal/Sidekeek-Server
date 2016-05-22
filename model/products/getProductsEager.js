var mysql = require('mysql');

function getProductsEager(router,connection){
  var self=this;
  self.handleRoutes(router,connection)
}

getProductsEager.prototype.handleRoutes = function(router,connection){
  router.post('/getProductsEager',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c re"});
    }else{
      var query = "select id_host from `session_host` where session_code='"+sessionCode+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error on checking sess quey","q":query});
        }else{
          if(rows.length>0){
            var idHost = rows[0].id_host;
            var result = {};
            var qProd = "select product.id_product,product.product_name,product.product_desc,product.price from `product` where product.id_host="+idHost;
            connection.query(qProd,function(err,rowsProduct){
              if(err){
                res.json({"message":"err.. error on selecting prod qProd","qprod":qProd});
              }else{
                if(rowsProduct.length>0){
                  // res.json(rowsProduct);
                  var q2 = "select gallery_product.id,gallery_product.img_base64,gallery_product.id_product from `gallery_product` join `product` on gallery_product.id_product=product.id_product where product.id_host="+idHost;
                  connection.query(q2,function(err,rowsImg){
                    if(err){
                      res.json({"message":"err.. error on selecting gallery img query"});
                    }else{
                      if(rowsImg.length>0){
                        res.json({"message":"success, take product and its gallery","product":rowsProduct,"images":rowsImg});
                      }else{
                        res.json({"message":"success, just take its product desc","product":rowsProduct});
                      }
                    }
                  });
                  // for (var i = 0; i < rows.length; i++) {
                  //   var idProduct = rows[i].id_product;
                  //   var productName = rows[i].product_name;
                  //   var productDesc = rows[i].product_desc;
                  //   var price = rows[i].price;
                  //
                  //   var qEager = "select id as id_gallery_img,img_base64 from `gallery_product` where id_product="+idProduct;
                  //   connection.query(qEager,function(err,rowsz){
                  //     if(err){
                  //       res.json({"message":"err.. error on eager selecting prod gal"});
                  //       return;
                  //     }else{
                  //       result[i] = {"idProduct":idProduct,"productName":productName,"productDesc":productDesc,"price":price,"gallery_img":rowsz};
                  //        res.send(result[i]);
                  //     }
                  //   });
                  // }
                }else{
                  res.json({"message":"err.. no rows on product"});
                }
              }
            });
          }else{
            res.json({"message":"err.. no rows on session"});
          }
        }
      });
    }
  });
}

module.exports = getProductsEager;
