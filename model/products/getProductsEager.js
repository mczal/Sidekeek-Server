var mysql = require('mysql');

function getProductsEager(router,connection){
  var self=this;
  self.handleRoutes(router,connection)
}

getProductsEager.prototype.handleRoutes = function(router,connection){
  router.get('/getProductsEager/:id',function(req,res){
    var idHost = connection.escape(req.params.id);
    var size = req.query.size;
    var page = req.query.page;
    if(idHost == null || idHost == undefined || idHost == ''){
      res.json({"message":"err.. no params i_h re","error":"error","products":null,"products_with_images":null});
    }else{
      if(size == null || size == undefined || size == ''){
        res.status(422).json({"message":"err.. no params rec","error":"error"});
      }else {
        if(page == null || page == undefined || page == ''){
          res.status(422).json({"message":"err.. no params rec","error":"error"});
        }else{
          var query = "select id_host from `host` where id_host="+idHost+" and statusz=1";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on checking sess quey","q":query,"error":"error","products":null,"products_with_images":null});
            }else{
              if(rows.length>0){
                // var idHost = rows[0].id_host;
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
                          res.json({"message":"err.. error on selecting gallery img query","error":"error","products":null,"products_with_images":null});
                        }else{
                          if(rowsImg.length>0){
                            var objTemp = new Array();
                            for(var i = 0 ; i<rowsProduct.length ; i++){
                              var pTemp = {
                                id_product : rowsProduct[i].id_product,
                                product_name : rowsProduct[i].product_name,
                                product_desc : rowsProduct[i].product_desc,
                                price : rowsProduct[i].price,
                                images : "",
                              };
                              objTemp[i] = pTemp;
                              var ct = 0;
                              for(var j = 0 ; j<rowsImg.length ; j++){
                                if(rowsImg[j].id_product == objTemp[i].id_product ){
                                  objTemp[i].images +=rowsImg[j].id+","+rowsImg[j].img_base64+";";
                                }
                              }
                            }
                            // res.json({"objTemp":objTemp});

                            var sumContentLength = objTemp.length;
                            if(size < sumContentLength){
                              var parts = Math.ceil(sumContentLength/size);
                              // console.log(sumContentLength+"/"+size+"="+parts);
                              // if((sumContentLength%size)>0){
                              //   parts+=1;
                              // }
                              var start0 = size*(page-1);
                              var end0 = start0*1+size*1;
                              if(end0>objTemp.length)end0=objTemp.length;

                              res.json({"message":"success, take product and it's gallery",
                              "error":"success","content":{"products":null,
                              "products_with_images":objTemp.splice(start0,(end0-start0)),
                                "pageTotal":parts,"totalRecords":sumContentLength} });

                            }else{
                              res.json({"message":"success, take product and it's gallery",
                              "error":"success","content":{"products":null,
                              "products_with_images":objTemp,"pageTotal":parts,"totalRecords":sumContentLength} });
                            }
                          }else{
                            var sumContentLength = rowsProduct.length;
                            if(size < sumContentLength){
                              var parts = Math.ceil(sumContentLength/size);
                              // console.log(sumContentLength+"/"+size+"="+parts);
                              // if((sumContentLength%size)>0){
                              //   parts+=1;
                              // }
                              var start0 = size*(page-1);
                              var end0 = start0*1+size*1;
                              if(end0>rowsProduct.length)end0=rowsProduct.length;

                              res.json({"message":"success, just take it's product desc",
                              "error":"success","content":
                              {"products":rowsProduct.splice(start0,(end0-start0)),
                              "products_with_images":null,"pageTotal":parts,"totalRecords":sumContentLength} });
                            }else{
                              res.json({"message":"success, just take it's product desc",
                              "error":"success","content":
                              {"products":rowsProduct,
                              "products_with_images":null,"pageTotal":1,"totalRecords":sumContentLength} });
                            }
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
                      res.json({"message":"err.. no rows on product","error":"error","products":null,"products_with_images":null});
                    }
                  }
                });
              }else{
                res.json({"message":"err.. no rows on idH","error":"error","products":null,"products_with_images":null});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = getProductsEager;
