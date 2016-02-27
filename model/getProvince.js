var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getProvince(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getProvince.prototype.handleRoutes = function(router,connection){
  router.post("/getProvince",function(req,res){
    connection.query("select province_name from `province` order by province_name asc",function(err,rows){
      if(err){
        res.json({"message":"err.. error in selecting province"});
      }else{
        if(rows.length>0){
          res.json(rows);
        }else{
          res.json({"message":"err.. no rows in selecting province"});
        }
      }
    })
  });
}

module.exports = getProvince;
