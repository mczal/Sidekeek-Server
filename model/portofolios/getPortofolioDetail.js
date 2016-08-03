var mysql = require('mysql');

function getPortofolioDetail(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getPortofolioDetail.prototype.handleRoutes = function(router,connection){
  router.get('/getPortofolioDetail/:id',function(req,res){
    var idPortofolio = req.params.id;
    if(idPortofolio==null || idPortofolio==undefined || idPortofolio==""){
      res.json({"message":"err.. no param rec","error":"error","content":null});
    }else{
      connection.query("select * from `portofolio` where id_portofolio="+idPortofolio,function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting porto","error":"error","content":null});
        }else{
          if(rows.length>0){
            res.json({"message":"success get portofolio detail","error":"success","content":rows});
          }else{
            res.json({"message":"err.. no rows match in portofolio","error":"error","content":null});
          }
        }
      });
    }
  });
}

module.exports = getPortofolioDetail;
