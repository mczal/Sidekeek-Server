var mysql = require('mysql');

function signUp(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

function generateUniqueCode(){
    var text = "";
    var possible = "[&900qnw@ml;kNI./UBI~`189`aklm3076IAKU-PASTI-BISA';l";

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
                      query="insert into `host` (email,password,unique_code) values('"+email+"','"+password+"','"+uniqueCode+"')";
                      connection.query(query,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error in inserting host"});
                        }else{
                          res.json({"message":"success inserting new host, please proceed with confirmation"});
                          //DELETE TEMP HOST ATAU TIDAK...?? ---

                          //----
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
                              res.json({"message":"err.. error in inserting host on q2"});
                            }else{
                              res.json({"message":"success inserting new host on q2, please proceed with confirmation","unique_code":uniqueCode,"email":email});
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
