var mysql = require('mysql');

function search(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

search.prototype.handleRoutes = function(router,connection){
  router.post("/search",function(req,res){
    var category = req.body.category;
    var locationProv = req.body.location;
    var tipe = req.body.tipe;
    var field = req.body.field;


    var debugQ="";

    if(field==null || field==undefined){
      field="";
      debugQ+="fieldNullIn | ";
    }
    if(category==null || category==undefined){
      category="";
      debugQ+="categoryNullIn | ";
    }
    if(locationProv==null || locationProv==undefined){
      locationProv="";
      debugQ+="locProvNullIn | ";
    }
    if(tipe==null || tipe==undefined){
      tipe="";
      debugQ+="tipeNullIn | ";
    }
    var query="select company_name,img_url,bussiness_category.category_name,tagline,city.city_name,province.province_name, address,title,tipe.name as tipe from host join city on host.location=city.id_city join province on city.province=province.id_province join tipe on host.id_host=tipe.id_tipe join bussiness_category on host.category=bussiness_category.id_cat where bussiness_category.category_name like '%"+category+"%' and province.province_name like '%"+locationProv+"%' and (title like '%"+field+"%' or host.profile_desc like '%"+field+"%') and	tipe.name like '%"+tipe+"%' and statusz=1";
    connection.query(query,function(err,rows){
      if(err){
        res.json({"message":"err.. error in selecting"});
      }else{
        if(rows.length>0){
          res.json(rows);
        }else{
          res.json({"message":"no rows..."});
        }
      }
    });
  });
}

module.exports=search;
