var mysql = require('mysql');

function getAccount(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getAccount.prototype.handleRoutes = function(router,connection){
  router.post('/getAccount',function(req,res){
    var email = req.body.email;
    if(email == null || email == undefined || email == ''){
      res.json({"message":"err.. no params ems rec"});
    }else{
      connection.query("select company_name,about,handphone,city.city_name,address from `host` join `city` on host.location=city.id_city where email = '"+email+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting"});
        }else{
          if(rows.length>0){
            res.json(rows);
          }else{
            res.json({"message":"err.. no rows"});
          }
        }
      });
    }
  });
}

module.exports = getAccount;
