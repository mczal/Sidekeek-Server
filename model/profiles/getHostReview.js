function getHostReview(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getHostReview.prototype.handleRoutes = function(router,connection){
  router.get('/getHostReview/:id',function(req,res){
    var idHost = connection.escape(req.params.id);
    if(idHost == null || idHost == undefined || idHost == ''){
      res.status(422).json({"message":"err.. error no param i rec","error":"error"});
    }else{
      var query = "SELECT id,id_host,name,rate,comment FROM `review_host` where id_host="+idHost;
      connection.query(query,function(err,rows){
        if(err){
          res.status(500).json({"message":"err.. error on selecting","error":"error"});
        }else{
          res.status(200).json({"message":"success selecting","error":"success","content":rows});
        }
      });
    }
  });
}

module.exports = getHostReview;
