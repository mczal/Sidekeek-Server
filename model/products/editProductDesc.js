var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function editProductDesc(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

editProductDesc.prototype.handleRoutes = function(router,connection){
  router.post('/editProductDesc',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    var timestamp = req.body.timestamp;
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. no params rec"});
    }else{
      if(idProduct==null || idProduct==undefined || idProduct==''){
        res.json({"message":"err.. no params rec"});
      }else{
        if(timestamp==null || timestamp==undefined || timestamp==''){
          res.json({"message":"err.. "});
        }else{
          connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on selecting host"});
            }else{
              if(rows.length>0){
                var idHost = rows[0].id_host;
                var namaProduk = req.body.namaProduk;
                var harga = req.body.harga;
                var productDesc = req.body.productDesc;
                var query = "update `product` set product_name='"+namaProduk+"',product_desc='"+productDesc+"',price="+harga+" where id_host="+idHost+" and id_product="+idProduct;
                connection.query(query,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on updating","query":query});
                  }else{
                    //updating timestamp on session_host
                    connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on updating session"})
                      }else{
                        res.json({"message":"success updating your product and session last activity, happy sunday"});
                      }
                    });
                  }
                });
              }else{
                res.json({"message":"err.. no session registered"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = editProductDesc;
