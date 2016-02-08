var mysql = require('mysql');

function firstRegister(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

var self = this;

firstRegister.prototype.handleRoutes = function(router,connection){
  router.post("/firstRegister",function(req,res){
    var tipe = req.body.tipe;
    if(tipe==null || tipe==undefined || tipe==""){
      res.json({"message":"no params receive!"});
    }else{
      connection.query("select id_tipe from `tipe` where name='"+tipe+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting tipe"})
        }else{
          if(rows.length>0){
            var idTipe=rows[0].id_tipe;
            var randomUnique = Math.floor(Math.random()*9999);
            connection.query("insert into `host_temp` (random_unique,id_tipe) values ("+randomUnique+","+idTipe+")",function(err,rows){
              if(err){
                res.json({"message":"err.. error on inserting"});
              }else{
                connection.query("select id_host from `host_temp` where random_unique="+randomUnique,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on lookup id hosttemp"});
                  }else{
                    if(rows.length>0){
                      var idHost = rows[0].id_host;
                      res.json({"message":"success proceed next","myId":idHost,"tipe":idTipe});
                    }else{
                      res.json({"message":"err.. no rows in lookup id hosttemp"});
                    }
                  }
                });
              }
            });
          }else{
            res.json({"message":"err.. no rows match in tipe with given tipe.req"});
          }
        }
      });
    }
  });
}
module.exports = firstRegister;
