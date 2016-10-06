var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getPortofolios(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getPortofolios.prototype.handleRoutes = function(router,connection){
  router.get('/getPortofolios/:id',function(req,res){
    var idHost = connection.escape(req.params.id);
    if(idHost==null || idHost==undefined || idHost==''){
      res.json({"message":"err.. no params received"});
    }else{
      connection.query("select id_host from `host` where statusz=1 and id_host="+idHost+"",function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting host from id","error":"error","content":null});
        }else{
          if(rows.length>0){
            // var idHost = rows[0].id_host;
            connection.query("select * from `portofolio` where id_host="+idHost,function(err,rows){
              if(err){
                res.json({"message":"err.. error in selecting on portofolio","error":"error","content":null});
              }else{
                if(rows.length>0){
                  res.json({"message":"success get all portofolio from #"+idHost,"error":"success","content":rows});
                }else{
                  res.json({"message":"err.. no rows in portofolio","error":"error","content":null});
                }
              }
            });
          }else{
            res.json({"message":"err.. no rows in host with given id and active status","error":"error","content":null});
          }
        }
      });
    }
  });
}

module.exports = getPortofolios;
