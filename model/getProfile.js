var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function getProfile(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getProfile.prototype.handleRoutes = function(router,connection){
  router.post("/getProfile",function(req,res){
    var email=req.body.email;
    if(email==null || email==undefined){
      res.json({"message":"err.. no params received"});
    }else{
      var query = "select email,company_name,img_base64,bussiness_category.category_name,tagline,profile_desc,city.city_name,province.province_name,address,title,tipe.name as tipe from host join city on host.location=city.id_city join province on city.province=province.id_province join tipe on host.id_host=tipe.id_tipe join bussiness_category on host.category=bussiness_category.id_cat where email='"+email+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting data"});
        }else{
          if(rows.length>0){
            res.json(rows);
          }else{
            connection.query("select email,company_name,img_base64,tagline,profile_desc,address,title,category,location,id_tipe,region from `host` where email='"+email+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting host by email"});
              }else{
                if(rows.length>0){
                  // var companyName = rows[0].company_name;
                  // var imgBase64 = rows[0].img_base64;
                  // var tagline = rows[0].tagline;
                  // var profileDesc = rows[0].profile_desc;
                  // var address = rows[0].address;
                  // var title = rows[0].title;
                  // //id id-an
                  // var idCat = rows[0].category;
                  // var location = rows[0].location;
                  // var idTipe = rows[0].id_tipe;
                  // var region = rows[0].region;
                  // //category lookup
                  //
                  res.json(rows);
                }else{
                  res.json({"message":"no rows mean no email registered in datas"});
                }
              }
            });
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
