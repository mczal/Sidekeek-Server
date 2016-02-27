var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getCategories(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getCategories.prototype.handleRoutes = function(router,connection){
  router.post("/getCategories",function(req,res){
    connection.query("select category_name from `bussiness_category` order by category_name asc",function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting cat"});
      }else{
        if(rows.length>0){
          res.json(rows);
        }else{
          res.json({"message":"err.. no rows in cat"});
        }
      }
    });
  });
}

module.exports = getCategories;
