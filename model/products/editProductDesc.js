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
    if(sessionCode==null || sessionCode==undefined || sessionCode==''){
      res.json({"message":"err.. no params rec","error":"error"});
    }else{
      if(idProduct==null || idProduct==undefined || idProduct==''){
        res.json({"message":"err.. no params rec","error":"error"});
      }else{
        connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error on selecting host","error":"error"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var namaProduk = req.body.namaProduk;
              var harga = req.body.harga;
              var productDesc = req.body.productDesc;
              var query = "update `product` set product_name='"+namaProduk+"',product_desc='"+productDesc+"',price="+harga+" where id_host="+idHost+" and id_product="+idProduct;
              connection.query(query,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on updating","query":query,"error":"error"});
                }else{
                  //updating timestamp on session_host
                  var myDate = new Date();
                  var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                  "-"+myDate.getDate()+" "+myDate.getHours()+
                  ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                  connection.query("update `session_host` set last_activity='"+myTimestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on updating session","error":"error"})
                    }else{
                      res.json({"message":"success updating your product and session last activity, happy sunday","error":"success"});
                    }
                  });
                }
              });
            }else{
              res.json({"message":"err.. no session registered","error":"error"});
            }
          }
        });
      }
    }
  });
}

module.exports = editProductDesc;
