var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getPortofolios(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getPortofolios.prototype.handleRoutes = function(router,connection){
  router.post('/getPortofolios',function(req,res){
    var email = req.body.email;
    if(email==null || email==undefined || email==''){
      res.json({"message":"err.. no params received"});
    }else{
      connection.query("select id_host from `host` where statusz=1 and email='"+email+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting host from email"});
        }else{
          if(rows.length>0){
            var idHost = rows[0].id_host;
            connection.query("select * from `portofolio` where id_host="+idHost,function(err,rows){
              if(err){
                res.json({"message":"err.. error in selecting on portofolio"});
              }else{
                if(rows.length>0){
                  res.json(rows);
                }else{
                  res.json({"message":"err.. no rows in portofolio"});
                }
              }
            });
          }else{
            res.json({"message":"err.. no rows in host with given email and active status"});
          }
        }
      });
    }
  });
}

module.exports = getPortofolios;
