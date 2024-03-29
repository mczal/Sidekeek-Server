function addHostReview(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

addHostReview.prototype.handleRoutes = function(router,connection){
  router.post('/addHostReview',function(req,res){
    var sessionCode = connection.escape(req.body.sessionCode);
    var score = connection.escape(req.body.score);
    var idHost = connection.escape(req.body.idHost);
    var comment = connection.escape(req.body.comment);
    var name = connection.escape(req.body.name);
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.status(422).json({"message":"err.. error no param s_c rec","error":"error"});
    }else{
      if(score == null || score == undefined || score == ''){
        res.status(422).json({"message":"err.. error no param s rec","error":"error"});
      }else{
        if(comment == null || comment == undefined || comment == ''){
          res.status(422).json({"message":"err.. error no param c rec","error":"error"});
        }else{
          if(name == null || name == undefined || name == ''){
            res.status(422).json({"message":"err.. error no param n rec","error":"error"});
          }else{
            if(idHost == null || idHost == undefined || idHost == ''){
              res.status(422).json({"message":"err.. error no param i_h rec","error":"error"});
            }else{
              var query = "select id_host from `session_host` where session_code="+sessionCode;
              connection.query(query,function(err,rows){
                if(err){
                  res.json({"message":"err.. error on checking sess quey","q":query});
                }else{
                  if(rows.length>0){
                    connection.beginTransaction(function(err){
                      if (err) {
                        res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                        return;
                      }
                      var idHostReviewer = rows[0].id_host;
                      var q1 = "INSERT INTO `review_host`(id_host,name,rate,comment) VALUES("+idHost+","+name+","+score+","+comment+");";
                      connection.query(q1,function(err,rows){
                        if(err){
                          connection.rollback(function(){
                            res.status(500).json({"message":"err.. error on inserting q","error":"error","objErr":err});
                            return;
                          });
                        }
                                                  // 2. Add SUM AVG Rate on host
                        var q2 = "SELECT COUNT(review_host.id) as totalReview,"+
                        "SUM(review_host.rate) as sumRate FROM `review_host` "+
                        "WHERE review_host.id_host="+idHost;
                          connection.query(q2,function(err,rows){
                            if(err){
                              connection.rollback(function(){
                                res.status(500).json({"message":"err.. error on aggrgt","error":"error","objErr":err});
                                return;
                              });
                            }else{
                              if(rows.length > 0){
                                var sum = rows[0].sumRate;
                                var total = rows[0].totalReview;
                                var q3 = "UPDATE `host` SET sumrate_totalreview='"+sum+"_"+total+"'"+" WHERE id_host="+idHost;
                                connection.query(q3,function(err,rows){
                                  if(err){
                                    connection.rollback(function(){
                                      res.status(500).json({"q":q3,"message":"err.. error on update host","error":"error","objErr":err});
                                      return;
                                    });
                                  }else{
                                    connection.commit(function(err) {
                                      if (err) {
                                        connection.rollback(function() {
                                          res.json({"message":"err.. error commiting transaction","error":"error","objErr":err});
                                          return;
                                        });
                                      }else{
                                        res.json({"message":"success add host review","error":"success"});
                                      }
                                    });
                                  }
                                });
                              }else{
                                connection.rollback(function(){
                                  res.status(500).json({"message":"err.. data not found","error":"error","objErr":err});
                                  return;
                                });
                              }
                            }
                          });
                      });
                    });
                  }else{
                    res.json({"message":"err.. no rows on session","error":"invalidSession"});
                  }
                }
              });
            }
          }
        }
      }
    }
  });
}

module.exports = addHostReview;
