var mysql = require('mysql');

function editProfile(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}
//see on location line 28
editProfile.prototype.handleRoutes = function(router,connection){
  router.post('/editProfile',function(req,res){
    var sessionCode = req.body.sessionCode;
    connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
      if(err){
        res.json({"message":"err.. error selecting host from session"});
      }else{
        if(rows.length>0){
          var idHost = rows[0].id_host;
          var companyName = req.body.companyName;
          var tagline = req.body.tagline;
          var businessCategory = req.body.businessCategory;
          var location = req.body.location;
          connection.query("select id_cat from `bussiness_category` where category_name='"+businessCategory+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error on selecting bussiness Category with given name"});
            }else{
              if(rows.length>0){
                var idCat = rows[0].id_cat;
                connection.query("select id_city",function(err,rows){
                  //locationnya apa nih ???
                });
              }else{
                res.json({"message":"err.. no rows on bussinessCategory with given its name"});
              }
            }
          });
        }else{
          res.json({"message":"err.. no rows on host with given session"});
        }
      }
    });

  });
}

module.exports = editProfile;
