var mysql = require('mysql');

function editProductImage(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

editProductImage.prototype.handleRoutes = function(router,connection){
  router.post('/editProductImage',function(err,rows){
    var sessionCode = req.body.sessionCode;
    var idProductImage = req.body.idProductImage;
    var timestamp = req.body.timestamp;
    var imgbase64 = req.body.imgbase64;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c received"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no params i_p received"});
      }else{
        if(timestamp == null || timestamp == undefined || timestamp == ''){
          res.json({"message":"err.. no params t_s received"});
        }else{
          if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
            res.json({"message":"err.. no params i_b_6 received"});
          }else{
            var q1 = "select id_host from `session_host` where session_code='"+sessionCode+"'";
            connection.query(q1,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting sess"});
              }else{
                if(rows.length>0){
                  var idHost = rows[0].id_host;
                  connection.query("",function(err,rows){

                  });
                }else{
                  res.json({"message":"err.. no rows on s_c"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = editProductImage;
