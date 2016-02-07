var mysql = require('mysql');

function editProfile(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

editProfile.prototype.handleRoutes = function(router,connection){
  router.post("/editProfile",function(req,res){
    //myFUNCTION
    function getEmail(){
      if(req.body.email == null || req.body.email == undefined){
        return "";
      }else{
        return req.body.email;
      }
    }
    //cannot empty --> -1
    function getCompanyName(){
      if(req.body.companyName == null || req.body.companyName==undefined){
        return -1;
      }else{
        return req.body.companyName;
      }
    }

    function getImgUrl(){
      if(req.body.imgUrl == null || req.body.imgUrl == undefined){
        return "";
      }else{
        return req.body.imgUrl;
      }
    }
    //cannot empty --> -1
    function getCategory(){
      if(req.body.category==null || req.body.category==undefined){
        return -1;
      }else{
        return req.body.category;
      }
    }

    function getTagline(){
      if(req.body.tagline==null || req.body.tagline==undefined){
        return "";
      }else{
        return req.body.tagline;
      }
    }

    function getProfileDesc(){
      if(req.body.profileDesc==null || req.body.profileDesc==undefined){
        return -1;
      }else{
        return req.body.profileDesc;
      }
    }

    function getLocation(){
      return req.body.location;
    }

    function

    //end of myFUNCTION
    var email = "";
    var companyName = ;
    var imgUrl = ;
    var category = ;
    var tagline = ;
    var profileDesc = ;
    var location = req.body.location;
    var address = req.body.address;
    var title = req.body.title;
    var idTipe = req.body.idTipe;

  });
}

module.exports = editProfile;
