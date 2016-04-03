var mysql = require('mysql');

function getPortofolioDetail(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getPortofolioDetail.prototype.handleRoutes = function(router,connection){
  router.post('/getPortofolioDetail',function(req,res){
    var idPortofolio = req.body.idPortofolio;
    if(idPortofolio==null || idPortofolio==undefined || idPortofolio==""){
      res.json({"message":"err.. no param rec"});
    }else{
      connection.query("select * from `portofolio` where id_portofolio="+idPortofolio,function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting porto"});
        }else{
          if(rows.length>0){
            res.json(rows);
          }else{
            res.json({"message":"err.. no rows match in portofolio"});
          }
        }
      });
    }
  });
}

module.exports = getPortofolioDetail;
