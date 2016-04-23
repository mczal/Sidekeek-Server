var mysql = require('mysql');

function isHost(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

isHost.prototype.handleRoutes = function(router,connection){
  router.post('/isHost',function(req,res){
    var email = req.body.email;
    connection.query("select id_tipe from `host` where email='"+email+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting"});
      }else{
        if(rows.length>0){
          var tipe = rows[0].id_tipe;
          if(tipe == null || tipe == undefined || tipe == ''){
            res.json({"message":"success","ket":"seeker","code":"0"});
          }else{
            res.json({"message":"success","ket":"host","code":"1"});
          }
        }else{
          res.json({"message":"err.. no rows"});
        }
      }
    });
  });
}

module.exports = isHost;
