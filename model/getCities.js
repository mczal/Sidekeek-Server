var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016

// DEPRECATED
function getCities(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getCities.prototype.handleRoutes = function(router,connection){
  router.get("/getCities",function(req,res){
    var province = connection.escape(req.body.province);
    if(req.body.province==null || req.body.province==undefined || req.body.province==""){
      connection.query("select id_city,city_name from `city` order by city_name asc",function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting city"});
        }else{
          if(rows.length>0){
            res.json(rows);
          }else{
            res.json({"message":"err.. no rows in city"});
          }
        }
      });
    }else{
      connection.query("select id_province from `province` where province_name="+province+"",function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting province with given name"});
        }else{
          if(rows.length>0){
            var idProv = rows[0].id_province;
            connection.query("select city_name from `city` where province="+idProv+" order by city_name asc",function(err,rows){
                if(err){
                  res.json({"message":"err.. error in selecting cityname"});
                }else{
                  if(rows.length>0){
                    res.json(rows);
                  }else{
                    res.json({"message":"err.. no rows in city with given province"});
                  }
                }
            });
          }else{
            res.json({"message":"err.. no rows in province with given name"});
          }
        }
      });
    }
  });
}

module.exports = getCities;
