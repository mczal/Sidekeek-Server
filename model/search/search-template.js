var mysql = require('mysql');

function searchTemplate(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

searchTemplate.prototype.handleRoutes = function(router,connection){
  router.get('/search-template',function(req,res){
    // req.accepts('application/json');
    var query = req.query.query;
    var keywords = req.query.keywords;
    // console.log("%real request keyword"+req.body.keywords+"%");
    // var whereClause = "WHERE 1=1";
    if(query == null || query == undefined || query == ''){
      res.json({"message":"gagils","query":"%"+query+"%"});
    }else{
      if(keywords == null || keywords == undefined || keywords == ''){
        var words = query.split(" ");
        var wordBuilder = "";
        for (var i = 0; i < words.length; i++) {
          words[i]+="*";
          wordBuilder+=words[i]+" ";
        }

        var query_builder_host = "SELECT 'host' as identifier, host.company_name, host.title, host.img_base64, "+
        "MATCH(host.title,host.company_name,host.company_desc) "+
        "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
        "from `host` WHERE (host.id_tipe IS NOT NULL) AND (host.statusz=1) "+
        "HAVING pscore > 0 order by pscore DESC LIMIT 5;"
        connection.query(query_builder_host,function(err,rowsHost){
          if(err){
            res.json({"message":"err.. error searching querify","error":err,"query_builder_host":query_builder_host,"keywords":keywords});
          }else{
            var query_builder = "SELECT 'product' as identifier, host.company_name, host.title, host.img_base64,"+
            "product.id_product, product.product_name, gallery_product.img_base64 as product_img_rep, "+
            "product.product_desc,host.company_desc,"+
            "MATCH(product.product_name,product.product_desc) "+
            "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
            "from `product` join `host` on host.id_host=product.id_host join `gallery_product` on gallery_product.id_product=product.id_product "+
            "WHERE (gallery_product.isRepresentation=1) AND (host.statusz=1) AND (host.id_tipe IS NOT NULL) "+
            "HAVING pscore > 0 order by pscore DESC LIMIT 5;"
            connection.query(query_builder,function(err,rowsProduct){
              if(err){
                res.json({"message":"err.. error searching querify host","error":err,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
              }else{
                res.json({"message":"success","error":"success","content":{"hosts":rowsHost,"products":rowsProduct},"query_builder_host":query_builder_host,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
              }
            });
            // if(rows.length>0){
            //   res.json({"message":"success","error":"success","content":rows,"query_builder":query_builder,"keywords":keywords+"zal"});
            // }else{
            //   res.json({"message":"err.. no rows","query_builder":query_builder,"keywords":keywords});
            // }
          }
        });
      }else{
        keywords = JSON.parse(req.query.keywords);
        // console.log(keywords.category);
        var keywordsBuilder = "";
        if(keywords != null && keywords != undefined && keywords != ''){
        	var checker = 0;
        	var opCheck = 0;
        	if(keywords.category.length>0){
        		if(opCheck != checker){
        			keywordsBuilder+=" AND ";
        			opCheck++;
        		}
        		checker++;
        		keywordsBuilder+="(";
        		for(var i=0 ; i<keywords.category.length ; i++){
        			if(i>0){
        				keywordsBuilder+=" OR "
        			}
        			keywordsBuilder+="host.category="+keywords.category[i];
        		}
        		keywordsBuilder+=")";
        	}
        	//
        	if(keywords.location.length>0){
        		if(opCheck != checker){
        			keywordsBuilder+=" AND ";
        			opCheck++;
        		}
        		checker++;
        		keywordsBuilder+="(";
        		for(var i=0 ; i<keywords.location.length ; i++){
        			if(i>0){
        				keywordsBuilder+=" OR "
        			}
        			keywordsBuilder+="host.location="+keywords.location[i];
        		}
        		keywordsBuilder+=")";
        	}
        	//
        	if(keywords.tipe.length>0){
        		if(opCheck != checker){
        			keywordsBuilder+=" AND ";
        			opCheck++;
        		}
        		checker++;
        		keywordsBuilder+="(";
        		for(var i=0 ; i<keywords.tipe.length ; i++){
        			if(i>0){
        				keywordsBuilder+=" OR "
        			}
        			keywordsBuilder+="host.id_tipe="+keywords.tipe[i];
        		}
        		keywordsBuilder+=")";
        	}
        }
        // console.log(keywordsBuilder);
        //
        var words = query.split(" ");
        var wordBuilder = "";
        for (var i = 0; i < words.length; i++) {
          words[i]+="*";
          wordBuilder+=words[i]+" ";
        }

        var query_builder_host = "SELECT 'host' as identifier, host.company_name, host.title, host.img_base64, "+
        "MATCH(host.title,host.company_name,host.company_desc) "+
        "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
        "from `host` "+
        "WHERE (host.id_tipe IS NOT NULL) AND (host.statusz=1) AND  "+keywordsBuilder+" HAVING pscore > 0 order by pscore DESC LIMIT 5;"
        connection.query(query_builder_host,function(err,rowsHost){
          if(err){
            res.json({"message":"err.. error searching querify host","error":err,"query_builder_host":query_builder_host,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
          }else{
            var query_builder = "SELECT 'product' as identifier, host.company_name, host.title, host.img_base64,"+
            "product.id_product, product.product_name, gallery_product.img_base64 as product_img_rep, "+
            "product.product_desc,host.company_desc,"+
            "MATCH(product.product_name,product.product_desc) "+
            "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
            "from `product` join `host` on host.id_host=product.id_host join `gallery_product` on gallery_product.id_product=product.id_product "+
            "WHERE (gallery_product.isRepresentation=1) AND (host.id_tipe IS NOT NULL) AND (host.statusz=1) AND "+keywordsBuilder+" HAVING pscore > 0 order by pscore DESC LIMIT 5;"
            connection.query(query_builder,function(err,rowsProduct){
              if(err){
                res.json({"message":"err.. error searching querify product","error":err,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
              }else{
                res.json({"message":"success","error":"success","content":{"hosts":rowsHost,"products":rowsProduct},"query_builder_host":query_builder_host,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
              }
            });
            // if(rows.length>0){
            //
            //   //here
            //   res.json({"message":"success","error":"success","content":rows,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
            // }else{
            //   res.json({"message":"err.. no rows","query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
            // }
          }
        });
      }
    }
  });
}

module.exports = searchTemplate;
