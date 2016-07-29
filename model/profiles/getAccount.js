var mysql = require('mysql');

function getAccount(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

var dir = "http://localhost/Sidekeek-Server";
getAccount.prototype.handleRoutes = function(router,connection){
  router.get('/getAccount/:email',function(req,res){
    var email = req.params.email;
    console.log(email);
    if(email == null || email == undefined || email == ''){
      res.json({"message":"err.. no params ems rec","error":"error","content":null});
    }else{
      connection.query("select company_name,about,handphone,city.city_name,host.location,address,img_base64 from `host` join `city` on host.location=city.id_city where email = '"+email+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting","error":"error","content":null});
        }else{
          if(rows.length>0){
            res.json(rows);
          }else{
            connection.query("select company_name,about,handphone,location,address,img_base64 from `host` where email = '"+email+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting","error":"error","content":null});
              }else{
                if(rows.length>0){
                  res.json({"message":"success get account info #"+email,"error":"success","content":rows});
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
