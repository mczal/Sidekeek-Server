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
    var size = req.query.size;
    var page = req.query.page;
    var info =req.query.info;
    // console.log("%real request keyword"+req.body.keywords+"%");
    // var whereClause = "WHERE 1=1";
    console.log(keywords);
    if(query == null || query == undefined){
      res.json({"message":"err.. error no query","error":"error","query":"%"+query+"%"});
    }else{
      if(size == null || size == undefined || size == ''){
        res.json({"message":"err.. no query s rec","error":"error"});
      }else{
        if(page == null || page == undefined || page == ''){
          res.json({"message":"err.. no query p rec","error":"error"});
        }else{
          //here
          if(keywords == null || keywords == undefined || keywords == ''){
            var words = query.split(" ");
            var wordBuilder = "";
            for (var i = 0; i < words.length; i++) {
              words[i]+="*";
              wordBuilder+=words[i]+" ";
            }

            if(info == null || info == undefined || info == 'host' || info == '' || info == 'all'){
              var query_builder_host = "SELECT 'host' as identifier, host.id_host, host.company_name, host.title, host.img_base64, host.sumrate_totalreview, "+
              "MATCH(host.title,host.company_name,host.company_desc) "+
              "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
              "from `host` WHERE (host.id_tipe IS NOT NULL) AND (host.statusz=1) "+
              "HAVING pscore > 0 order by pscore DESC;"
              connection.query(query_builder_host,function(err,rowsHost){
                if(err){
                  res.json({"message":"err.. error searching querify","error":err,"query_builder_host":query_builder_host,"keywords":keywords});
                }else{
                  if(info == 'host'){
                    var sumContentLength = rowsHost.length;
                    if(size < sumContentLength){
                      var parts = Math.ceil(sumContentLength/size);
                      // console.log(sumContentLength+"/"+size+"="+parts);
                      // if((sumContentLength%size)>0){
                      //   parts+=1;
                      // }
                      var start0 = size*(page-1);
                      var end0 = start0*1+size*1;
                      if(end0>rowsHost.length)end0=rowsHost.length;
                      res.json({"message":"success","error":"success",
                                "content":{"hosts":rowsHost.splice(start0,(end0-start0)),"products":null,"pageTotal":parts,"totalRecords":sumContentLength},
                                "query_builder_host":query_builder_host,
                                "query_builder":query_builder,
                                "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                    }else{
                      res.json({"message":"success","error":"success",
                                "content":{"hosts":rowsHost,"products":null,"pageTotal":1,"totalRecords":sumContentLength},
                                "query_builder_host":query_builder_host,
                                "query_builder":query_builder,
                                "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                    }
                  }else{
                    var query_builder = "SELECT 'product' as identifier, host.id_host, host.company_name, host.title, host.img_base64, host.sumrate_totalreview, "+
                    "product.id_product, product.product_name, gallery_product.img_base64 as product_img_rep, "+
                    "product.product_desc,host.company_desc,"+
                    "MATCH(product.product_name,product.product_desc) "+
                    "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
                    "from `product` join `host` on host.id_host=product.id_host join `gallery_product` on gallery_product.id_product=product.id_product "+
                    "WHERE (gallery_product.isRepresentation=1) AND (host.statusz=1) AND (host.id_tipe IS NOT NULL) "+
                    "HAVING pscore > 0 order by pscore DESC;"
                    connection.query(query_builder,function(err,rowsProduct){
                      if(err){
                        res.json({"message":"err.. error searching querify host","error":err,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                      }else{
                        var sumContentLength = rowsProduct.length + rowsHost.length;
                        if(size < sumContentLength){
                          var parts = Math.ceil(sumContentLength/size);
                          // console.log(sumContentLength+"/"+size+"="+parts);
                          // if((sumContentLength%size)>0){
                          //   parts+=1;
                          // }
                          var start0 = size*(page-1);
                          var end0 = start0*1+size*1;
                          // 01 = product
                          var start01 = "false";
                          var end01 = "false";
                          if(start0 >= rowsHost.length){
                            start01 = start0-rowsHost.length;
                            end01 = start01*1+size*1;
                            // console.log(start01+" "+end01);
                            if(end01 > rowsProduct.length){
                              end01 = rowsProduct.length;
                            }
                          }
                          if((start01 == "false") && (end0 > rowsHost.length)){
                            end01 = end0-rowsHost.length;
                          }
                          // 3 condition, start h end h ; start h end p ; start p end p

                          if(start01 == "false" && end01 == "false"){
                            // 1 start h end h
                            res.json({"message":"success","error":"success",
                                      "content":{"hosts":rowsHost.splice(start0,size),"products":null,"pageTotal":parts,"totalRecords":sumContentLength},
                                      "query_builder_host":query_builder_host,
                                      "query_builder":query_builder,
                                      "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                          }else if (start01 == "false" && end01 != "false") {
                            // 2 start h end p
                            res.json({"message":"success","error":"success",
                                      "content":{"hosts":rowsHost.splice(start0,(rowsHost.length-start0)),"products":rowsProduct.splice(0,end01),"pageTotal":parts,"totalRecords":sumContentLength},
                                      "query_builder_host":query_builder_host,
                                      "query_builder":query_builder,
                                      "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                          }else if (start01 != "false" && end01 != "false") {
                            // 3 start p end p
                            // console.log(start01+" "+(end01));
                            res.json({"message":"success","error":"success",
                                      "content":{"hosts":null,"products":rowsProduct.splice(start01,(end01-start01)),"pageTotal":parts,"totalRecords":sumContentLength},
                                      "query_builder_host":query_builder_host,
                                      "query_builder":query_builder,
                                      "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                          }

                        }else{
                          res.json({"message":"success","error":"success","content":{"hosts":rowsHost,"products":rowsProduct,"pageTotal":1,"totalRecords":sumContentLength},"query_builder_host":query_builder_host,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                        }
                      }
                    });
                    // if(rows.length>0){
                    //   res.json({"message":"success","error":"success","content":rows,"query_builder":query_builder,"keywords":keywords+"zal"});
                    // }else{
                    //   res.json({"message":"err.. no rows","query_builder":query_builder,"keywords":keywords});
                    // }
                  }

                }
              });
            }else{
              var query_builder = "SELECT 'product' as identifier, host.id_host, host.company_name, host.title, host.img_base64, host.sumrate_totalreview, "+
              "product.id_product, product.product_name, gallery_product.img_base64 as product_img_rep, "+
              "product.product_desc,host.company_desc,"+
              "MATCH(product.product_name,product.product_desc) "+
              "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
              "from `product` join `host` on host.id_host=product.id_host join `gallery_product` on gallery_product.id_product=product.id_product "+
              "WHERE (gallery_product.isRepresentation=1) AND (host.statusz=1) AND (host.id_tipe IS NOT NULL) "+
              "HAVING pscore > 0 order by pscore DESC;"
              connection.query(query_builder,function(err,rowsProduct){
                if(err){
                  res.json({"message":"err.. error searching querify host","error":err,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                }else{
                  var sumContentLength = rowsProduct.length;
                  if(size < sumContentLength){
                    var parts = Math.ceil(sumContentLength/size);
                    var start0 = size*(page-1);
                    var end0 = start0*1+size*1;
                    if(end0>rowsProduct.length)end0=rowsProduct.length;
                    res.json({"message":"success","error":"success",
                              "content":{"hosts":null,"products":rowsProduct.splice(start0,(end0-start0)),"pageTotal":parts,"totalRecords":sumContentLength},
                              "query_builder_host":query_builder_host,
                              "query_builder":query_builder,
                              "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                  }else{
                    res.json({"message":"success","error":"success","content":{"hosts":rowsHost,"products":rowsProduct,"pageTotal":1,"totalRecords":sumContentLength},"query_builder_host":query_builder_host,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                  }
                }
              });
            }

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

            if(info == null || info == undefined || info == 'host' || info == '' || info == 'all'){
              var query_builder_host = "SELECT 'host' as identifier, host.id_host, host.company_name, host.title, host.img_base64, host.sumrate_totalreview, "+
              "MATCH(host.title,host.company_name,host.company_desc) "+
              "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
              "from `host` "+
              "WHERE (host.id_tipe IS NOT NULL) AND (host.statusz=1) AND  "+keywordsBuilder+" HAVING pscore > 0 order by pscore DESC;"
              connection.query(query_builder_host,function(err,rowsHost){
                if(err){
                  res.json({"message":"err.. error searching querify host","error":err,"query_builder_host":query_builder_host,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                }else{
                  if(info == 'host'){
                    var sumContentLength = rowsHost.length;
                    if(size < sumContentLength){
                      var parts = Math.ceil(sumContentLength/size);
                      // if((sumContentLength%size)>0){
                      //   parts+=1;
                      // }
                      var start0 = size*(page-1);
                      var end0 = start0+size;
                      if(end0 > rowsHost.length) end0=rowsHost.length;
                      res.json({"message":"success","error":"success",
                                "content":{"hosts":rowsHost.splice(start0,(end0-start0)),"products":null,"pageTotal":parts,"totalRecords":sumContentLength},
                                "query_builder_host":query_builder_host,
                                "query_builder":query_builder,
                                "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                    }else{
                      res.json({"message":"success","error":"success",
                                "content":{"hosts":rowsHost,"products":null,"pageTotal":1,"totalRecords":sumContentLength},
                                "query_builder_host":query_builder_host,
                                "query_builder":query_builder,
                                "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                    }
                  }else{
                    var query_builder = "SELECT 'product' as identifier, host.id_host, host.company_name, host.title, host.img_base64, host.sumrate_totalreview, "+
                    "product.id_product, product.product_name, gallery_product.img_base64 as product_img_rep, "+
                    "product.product_desc,host.company_desc,"+
                    "MATCH(product.product_name,product.product_desc) "+
                    "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
                    "from `product` join `host` on host.id_host=product.id_host join `gallery_product` on gallery_product.id_product=product.id_product "+
                    "WHERE (gallery_product.isRepresentation=1) AND (host.id_tipe IS NOT NULL) AND (host.statusz=1) AND "+keywordsBuilder+" HAVING pscore > 0 order by pscore DESC;"
                    connection.query(query_builder,function(err,rowsProduct){
                      if(err){
                        res.json({"message":"err.. error searching querify product","error":err,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                      }else{
                        var sumContentLength = rowsProduct.length + rowsHost.length;
                        if(size < sumContentLength){
                          var parts = Math.ceil(sumContentLength/size);
                          // if((sumContentLength%size)>0){
                          //   parts+=1;
                          // }
                          var start0 = size*(page-1);
                          var end0 = start0+size;
                          // 01 = product
                          var start01 = "false";
                          var end01 = "false";
                          if(start0 >= rowsHost.length){
                            start01 = start0-rowsHost.length;
                            end01 = start01+size;
                            if(end01 > rowsProduct.length){
                              end01 = rowsProduct.length;
                            }
                          }
                          if((start01 == "false") && (end0 > rowsHost.length)){
                            end01 = end0-rowsHost.length;
                          }
                          // 3 condition, start h end h ; start h end p ; start p end p

                          if(start01 == "false" && end01 == "false"){
                            // 1 start h end h
                            console.log(sumContentLength)
                            res.json({"message":"success","error":"success",
                                      "content":{"hosts":rowsHost.splice(start0,size),"products":null,"pageTotal":parts,"totalRecords":sumContentLength},
                                      "query_builder_host":query_builder_host,
                                      "query_builder":query_builder,
                                      "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                          }else if (start01 == "false" && end01 != "false") {
                            // 2 start h end p
                            res.json({"message":"success","error":"success",
                                      "content":{"hosts":rowsHost.splice(start0,(rowsHost.length-start0)),"products":rowsProduct.splice(0,end01),"pageTotal":parts,"totalRecords":sumContentLength},
                                      "query_builder_host":query_builder_host,
                                      "query_builder":query_builder,
                                      "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                          }else if (start01 != "false" && end01 != "false") {
                            // 3 start p end p
                            res.json({"message":"success","error":"success",
                                      "content":{"hosts":null,"products":rowsProduct.splice(start01,(end01-start01)),"pageTotal":parts,"totalRecords":sumContentLength},
                                      "query_builder_host":query_builder_host,
                                      "query_builder":query_builder,
                                      "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                          }
                        }else{
                          res.json({"message":"success","error":"success",
                          "content":{"hosts":rowsHost,"products":rowsProduct,"pageTotal":1,"totalRecords":sumContentLength},
                          "query_builder_host":query_builder_host,"query_builder":query_builder,
                          "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                        }
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
                }
              });
            }else{
              var query_builder = "SELECT 'product' as identifier, host.id_host, host.company_name, host.title, host.img_base64,"+
              "product.id_product, product.product_name, gallery_product.img_base64 as product_img_rep, "+
              "product.product_desc,host.company_desc,"+
              "MATCH(product.product_name,product.product_desc) "+
              "AGAINST ('"+wordBuilder.trim()+"' IN BOOLEAN MODE) as pscore "+
              "from `product` join `host` on host.id_host=product.id_host join `gallery_product` on gallery_product.id_product=product.id_product "+
              "WHERE (gallery_product.isRepresentation=1) AND (host.id_tipe IS NOT NULL) AND (host.statusz=1) AND "+keywordsBuilder+" HAVING pscore > 0 order by pscore DESC;"
              connection.query(query_builder,function(err,rowsProduct){
                if(err){
                  res.json({"message":"err.. error searching querify product","error":err,"query_builder":query_builder,"keywordsBuilder":keywordsBuilder,"keywords":keywords});
                }else{
                  var sumContentLength = rowsProduct.length;
                  if(size < sumContentLength){
                    var parts = Math.ceil(sumContentLength/size);
                    var start0 = size*(page-1);
                    var end0 = start0+size;
                    if(end0 > rowsProduct.length) end0=rowsProduct.length;
                    res.json({"message":"success","error":"success",
                    "content":{"hosts":null,"products":rowsProduct.splice(start0,(end0-start0)),"pageTotal":parts,"totalRecords":sumContentLength},
                    "query_builder_host":query_builder_host,"query_builder":query_builder,
                    "keywordsBuilder":keywordsBuilder,"keywords":keywords});
                  }else{
                    res.json({"message":"success","error":"success",
                    "content":{"hosts":null,"products":rowsProduct,"pageTotal":1,"totalRecords":sumContentLength},
                    "query_builder_host":query_builder_host,"query_builder":query_builder,
                    "keywordsBuilder":keywordsBuilder,"keywords":keywords});
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

module.exports = searchTemplate;
