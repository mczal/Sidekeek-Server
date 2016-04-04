var mysql = require('mysql');

function editAccount(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

editAccount.prototype.handleRoutes = function(router,connection){
  router.post('/editAccount',function(req,res){
    var sessionCode = req.body.sessionCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params received"});
    }else{
      var query = "select id_host from `session_host` where session_code='"+sessionCode+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error in selecting sess hos"});
        }else{
          if(rows.length>0){
            var idHost = rows[0].id_host;
            var imgbase64 = req.body.imgbase64;
            var companyName = req.body.companyName;
            var about = req.body.about;
            var handphone = req.body.handphone;
            var city = req.body.city;
            var address = req.body.address;
            if(imgbase64 == null || imgbase64 == undefined){
                imgbase64 = '';
            }
            if(companyName == null || companyName == undefined || companyName == ''){
              res.json({"message":"err.. no params rec,."});
            }else{
              if(about == null || about == undefined || about == ''){
                res.json({"message":"err.. no params rec about"});
              }else{
                if(handphone == null || handphone == undefined || handphone == ''){
                  res.json({"message":"err.. no params rec handphone"});
                }else{
                  if(city == null || city == undefined || city == ''){
                    res.json({"message":"err.. no params rec city"});
                  }else{
                    if(address == null || address == undefined || address == ''){
                      res.json({"message":"err.. no params rec address"});
                    }else{
                      connection.query("update `host` set company_name='"+companyName+"',about='"+about+"',handphone='"+handphone+"',location="+city+",address='"+address+"' where id_host ="+idHost,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error on updating","error":"error"});
                        }else{
                          res.json({"message":"success updating new value","error":"success"});
                        }
                      });
                    }
                  }
                }
              }
            }
          }else{
            res.json({"message":"err.. no rows"});
          }
        }
      });
    }
  });
}

module.exports = editAccount;
