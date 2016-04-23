var mysql = require('mysql');
var sendgrid = require('sendgrid')('mczal','Fahrizalsss*123#');
//TESTED 27 FEBRUARI 2016
function signUp(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var self=this;

signUp.prototype.handleRoutes = function(router,connection,md5){
  router.post("/sign-up",function(req,res){
    var statTemp = req.body.statTemp;
    var email = req.body.email;
    var password = md5(req.body.password);
    var confirmation = md5(req.body.confirmation);
    if(email==null || email==undefined || email==""){
      res.json({"message":"err.. no params em rec"});
    }else{
      if(req.body.password==null || req.body.password==undefined || req.body.password==""){
        res.json({"message":"err.. no params pass rec"});
      }else{
        if(req.body.confirmation==null || req.body.confirmation==undefined || req.body.confirmation==""){
          res.json({"message":"err.. no params confirm rec"});
        }else{
            if(confirmation == password){
              //check email available...
              connection.query("select id_host from `host` where email='"+email+"'",function(err,rows){
                if(err){
                  res.json({"message":"err.. error in checking availability email.."});
                }else{
                  if(rows.length>0){
                    res.json({"message":"err.. email is already resgistered"});
                  }else{
                    //email are checked and it is available
                    //inserting and registering
                    var query="";
                    var query2="";
                    var uniqueCode = generateUniqueCode();
                    if(statTemp==null || statTemp==undefined || statTemp==""){
                      query="insert into `host` (email,password,unique_code,statusz) values('"+email+"','"+password+"','"+uniqueCode+"',0)";
                      connection.query(query,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error in inserting host","query":query});
                        }else{
                          /*TODO: INI SEND MAIL CONFIRMATION*/
                          sendgrid.send({
                            to:       email,
                            from:     'noreply@sidekeek.co',
                            subject:  'Sidekeek Account Confirmation',
                            text:     'Please click the following link below to confirm your account on sidekeek.co',
                            html:     "<p>Please click the following link below to confirm your account on sidekeek.co</p><a href='#'><button>CLICK  ME!!!!</button><p><b>"+uniqueCode+"</b></p></a>",
                          }, function(err, json) {
                            if (err) {
                              res.json({"message":'AAAAAHH!!',"err":err});
                              return console.error(err);
                            }
                            res.json({"message":"success inserting new host, please proceed with confirmation","status":0,"unique_code":uniqueCode,"jsonsgrid":json}); //status 0 berarti signup doang
                            console.log(json);
                          });
                        }
                      });
                    }else{
                      query="update `host_temp` set email='"+email+"',password='"+password+"' where stat_temp='"+statTemp+"'";
                      query2="insert into `host` (email,password,company_name,category,title,id_tipe,statusz,unique_code) select email,password,company_name,category,title,id_tipe,0,'"+uniqueCode+"' from `host_temp` where stat_temp='"+statTemp+"'";
                      connection.query(query,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error in updating host_temp"});
                        }else{
                          connection.query(query2,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error in inserting host on q2","query2":query2});
                            }else{
                              /* TODO: INI SEND MAIL CONFIRMATION*/
                              sendgrid.send({
                                to:       email,
                                from:     'noreply@sidekeek.co',
                                subject:  'Sidekeek Account Confirmation',
                                text:     'Please click the following link below to confirm your account on sidekeek.co',
                                html:     "<p>Please click the following link below to confirm your account on sidekeek.co</p><a href='#'><button>CLICK  ME!!!!</button><p><b>"+uniqueCode+"</b></p></a>"
                              }, function(err, json) {
                                if (err) {
                                  res.json({"message":'AAAAAHH!!',"err":err});
                                  return console.error(err);
                                }
                                console.log(json);
                                // TODO: DELETE TEMP HOST ATAU TIDAK...??
                                //JAWABAN :: IYAA
                                connection.query("delete from `host_temp` where statTemp = '"+statTemp+"'",function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error on deleting host_temp"});
                                  }else{
                                    res.json({"message":"success inserting new host on q2, please proceed with confirmation","unique_code":uniqueCode,"email":email,"status":1});//status 1 berarti udah register dari awal
                                  }
                                });
                              });
                            }
                          });
                        }
                      });
                    }
                  }
                }
              });
            }else{
              res.json({"message":"password and confirmation not match !"});
            }
        }
      }
    }
  });
}

module.exports = signUp;
