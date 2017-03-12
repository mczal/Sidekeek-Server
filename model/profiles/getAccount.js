var mysql = require('mysql');

function getAccount(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

var dir = "http://localhost/Sidekeek-Server";
getAccount.prototype.handleRoutes = function(router,connection){
  router.get('/getAccount/:id',function(req,res){
    var idHost = connection.escape(req.params.id);
    // console.log(email);
    if(idHost == null || idHost == undefined || idHost == ''){
      res.json({"message":"err.. no params iH rec","error":"error","content":null});
    }else{
      connection.query("select id_tipe,email,company_name,about,handphone,city.city_name,host.location,address,img_base64 from `host` join `city` on host.location=city.id_city where id_host = "+idHost+"",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting","error":"error","content":null});
        }else{
          if(rows.length>0){
            res.json({"message":"success get account info #"+idHost,"error":"success","content":rows});
          }else{
            connection.query("select id_tipe,email,company_name,about,handphone,location,address,img_base64 from `host` where id_host = "+idHost+"",function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting","error":"error","content":null});
              }else{
                if(rows.length>0){
                  res.json({"message":"success get account info #"+idHost,"error":"success","content":rows});
                }else{
                  res.json({"message":"err.. no rows","error":"error","content":null});
                }
              }
            });
          }
        }
      });
    }
  });
}

module.exports = getAccount;
