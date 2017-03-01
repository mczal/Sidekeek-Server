var mysql = require('mysql');

function search(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

search.prototype.handleRoutes = function(router,connection){
  router.get("/search",function(req,res){
    var query = req.query.query;
    var keywords = req.query.keywords;
    var whereClause = "WHERE 1=1";
    console.log(req.query);
    if(query == null || query == undefined || query == ''){
      res.json({"message":"err.. no param q received"});
    }else{
      // if(keywords == null || keywords == undefined || keywords == ''){
      //   keywords=whereClause+" AND "+keywords;
      // }

      // var querifyz = "SELECT product.id_product, "+
      // "MATCH(product.product_name,product.product_desc) "+
      // "AGAINST ('my' IN NATURAL LANGUAGE MODE) as pscore "+
      // "FROM `product` order by pscore DESC LIMIT 5"
      //
      // var columns = query;
      // var querify = "SELECT product.id_product','MATCH(product.product_name,product.product_desc) AGAINST ( ? IN NATURAL LANGUAGE MODE) as pscore FROM ?? order by ??  DESC LIMIT 5"+
      // "AGAINST ('my' IN NATURAL LANGUAGE MODE) as pscore "+
      // "FROM `product` order by pscore DESC LIMIT 5 ";
      var words = query.split(" ");
      var wordBuilder = "";
      for (var i = 0; i < words.length; i++) {
        words[i]+="*";
        wordBuilder+=words[i]+" ";
      }

      var query_builder = "SELECT host.company_name, host.title, host.img_base64,"+
      "product.id_product, product.product_name,"+
      "product.product_desc,host.company_desc,"+
      "MATCH(product.product_name,product.product_desc) "+
      "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
      "from `product` join `host` on host.id_host=product.id_host "+
      "HAVING pscore > 0 order by pscore DESC LIMIT 5;"
      connection.query(query_builder,function(err,rows){
        if(err){
          res.json({"message":"err.. error searching querify","error":err,"query_builder":query_builder});
        }else{
          if(rows.length>0){
            res.json({"message":"success","error":"success","content":rows,"query_builder":query_builder});
          }else{
            res.json({"message":"err.. no rows","query_builder":query_builder});
          }
        }
      });
    }
  });
}

module.exports=search;
