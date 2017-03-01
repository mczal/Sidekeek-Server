var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getProfile(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getProfile.prototype.handleRoutes = function(router,connection){
  router.get("/getProfile/:id",function(req,res){
    var idHost = connection.escape(req.params.id);
    if(idHost==null || idHost==undefined){
      res.json({"message":"err.. no params received","error":"error","content":null});
    }else{
      var query = "select email,bussiness_category.category_name,host.category,company_desc,title,sumrate_totalreview,tipe.id_tipe,tipe.name as tipe,host.id_tipe from `host` join `tipe` on host.id_tipe=tipe.id_tipe join `bussiness_category` on host.category=bussiness_category.id_cat where host.id_host="+idHost;
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting data","query":query,"error":"error","content":null});
        }else{
          if(rows.length>0){
            res.json({"message":"success get profile info #"+idHost,"error":"success","content":rows});
          }else{
            res.json({"message":"err.. no rows","query":query,"error":"error","content":null});
          }
        }
      });
    }
  });
}

module.exports=getProfile;
//select email,company_name,
//      img_base64,category,tagline,profile_desc,
//      city.city_name,province.province_name,
//      address,title,tipe.name as tipe
//from
//host join city on host.location=city.id_city
//    join province on city.province=province.id_province
//    join tipe on host.id_host=tipe.id_tipe
