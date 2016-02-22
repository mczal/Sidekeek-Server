var mysql = require('mysql');

function addNewPortofolio(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addNewPortofolio.prototype.handleRoutes = function(router,connection){
  router.post('/addNewPortofolio',function(req,res){
    var sessionCode = req.body.sessionCode;
    var title = req.body.title;
    var description = req.body.description;
    var imgBase64 = req.body.imgBase64;
    if(title==null || title==undefined || title==''){
      res.json({"message":"err.. no params title received"});
    }else{
      if(description==null || description==undefined || description==''){
        res.json({"message":"err.. no params desc received"});
      }else{
        //imgbase64 validation not require..
        connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error in selecting host from session"});
          }else{
            if(rows.length>0){
              var idHost = rows[0].id_host;
              var query = "insert into `portofolio` (id_host,title,description,img_base64) values("+idHost+",'"+title+"','"+description+"','"+imgBase64+"')";
              connection.query(query,function(err,rows){
                if(err){
                  res.json({"message":"err.. error in inserting new portofolio","query":query});
                }else{
                  res.json({"message":"success inserting new portofolio"});
                }
              });
            }else{
              res.json({"message":"err.. no rows in session"});
            }
          }
        });
      }
    }
  });
}

module.exports = addNewPortofolio;
