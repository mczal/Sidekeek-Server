/* DEPRECATED */
var mysql = require('mysql');

function firstRegister(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

var self = this;

firstRegister.prototype.handleRoutes = function(router,connection){
  router.post("/firstRegister",function(req,res){
    var tipe = req.body.idTipe;
    var statTemp = req.body.statTemp;
    if(tipe==null || tipe==undefined || tipe==""){
      res.json({"message":"no params receive!","error":"error","myId":null,"tipe":null,"statTemp":statTemp});
    }else{
      if(statTemp==null || statTemp==undefined || statTemp==""){
        res.json({"message":"no params2 receive!","error":"error","myId":null,"tipe":null,"statTemp":statTemp});
      }else{
        // connection.query("select id_tipe from `tipe` where name='"+tipe+"'",function(err,rows){
          // if(err){
            // res.json({"message":"err.. error on selecting tipe","error":"error","myId":null,"tipe":null,"statTemp":statTemp})
          // }else{
            // if(rows.length>0){
              // var idTipe=rows[0].id_tipe;
              /*
              * var randomUnique
              * untuk select id host saja disini..di modul ini saja thanks.
              */
              var randomUnique = Math.floor(Math.random()*9999);
              connection.query("insert into `host_temp` (random_unique,id_tipe,stat_temp) values ("+randomUnique+","+tipe+",'"+statTemp+"')",function(err,rows){
                if(err){
                  res.json({"message":"err.. error on inserting","error":"error","myId":null,"tipe":null,"statTemp":statTemp});
                }else{
                  connection.query("select id_host from `host_temp` where random_unique="+randomUnique,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on lookup id hosttemp","error":"error","myId":null,"tipe":null,"statTemp":statTemp});
                    }else{
                      if(rows.length>0){
                        var idHost = rows[0].id_host;
                        res.json({"message":"success proceed next","error":"success","myId":idHost,"tipe":tipe,"statTemp":statTemp});
                      }else{
                        res.json({"message":"err.. no rows in lookup id hosttemp","error":"error","myId":null,"tipe":null,"statTemp":statTemp});
                      }
                    }
                  });
                }
              });
            // }else{
            //   res.json({"message":"err.. no rows match in tipe with given tipe.req","error":"error","myId":null,"tipe":null,"statTemp":statTemp});
            // }
          // }
        // });
      }
    }
  });
}
module.exports = firstRegister;
