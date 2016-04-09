var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getProductDetail(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getProductDetail.prototype.handleRoutes = function(router,connection){
  router.post('/getProductDetail',function(req,res){
    var idProduct = req.body.idProduct;
    if(idProduct == null || idProduct == undefined || idProduct == ''){
      res.json({"message":"err.. no param received"});
    }else{
      connection.query("select product_name,product_desc,price from `product` where id_product="+idProduct,function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting product with given id prodcut"});
        }else{
          if(rows.length>0){
            var productName = rows[0].product_name;
            var productDesc = rows[0].product_desc;
            var price = rows[0].price;
            connection.query("select id as id_gallery_img,img_base64 from `gallery_product` where id_product="+idProduct,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting galleryImg"});
              }else{
                res.json({"message":"success selecting","productName":productName,"productDesc":productDesc,"price":price,"content":rows});
              }
            });
          }else{
            res.json({"message":"err.. no rows in product with given idprod"});
          }
        }
      });
    }

  });
}

module.exports = getProductDetail;
