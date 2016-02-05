//BELUM DI MODIFFF !!!!
var mysql   = require("mysql");

function login(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

var self = this;

login.prototype.handleRoutes = function(router,connection,md5){
  router.post("/login",function(req,res){
    var email = req.body.email;
    var password = md5(req.body.password);
    connection.query("select password from `host` where email='"+email+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error in selecting first check"});
      }else{
        if(rows.length>0){
          if(password == rows[0].password){
            res.json({"message":"success login"});
          }else{
            res.json({"message":"invalid password"});
          }
        }else{
          res.json({"message":"err.. email not available"});
        }
      }
    });
  });
}

module.exports = login;
