var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getProducts(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getProducts.prototype.handleRoutes = function(router,connection){
  router.post('/getProducts',function(req,res){
    var email = req.body.email;
    if(email==null || email==undefined || email==''){
      res.json({"message":"err.. no params received"});
    }else{
      connection.query("select id_host from `host` where statusz=1 and email='"+email+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting host from email given"});
        }else{
          if(rows.length>0){
            var idHost = rows[0].id_host;
            var query = "select id_product,product_name,product_desc,price from `product` where id_host="+idHost;
            connection.query(query,function(err,rows){
              if(err){
                res.json({"message":"err.. error in selecting product with given host","query":query});
              }else{
                if(rows.length>0){
                  res.json(rows);
                }else{
                  res.json({"message":"err.. no rows in product with given host"});
                }
              }
            });
          }else{
            res.json({"message":"err.. no rows in selecting host.. (host not active or email not registered)"});
          }
        }
      });
    }
  });
}

module.exports = getProducts;
