var mysql = require('mysql');
var mkpath = require('mkpath');
var fs = require('fs');

// var pictureServerPort = "8080"; //EMPTY if not neccessary
// var baseUrlPath = "http://localhost:"+pictureServerPort+"/Sidekeek-Server/";
function generateUniqueCode(){
    var text = "";
    var possible = "&900qnw@mlkNIUBI~aklm3076IAKU-PASTI-BISAl";;

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function addProductImage(router,connection,config){
  var self=this;
  self.handleRoutes(router,connection,config);
}

var self=this;

addProductImage.prototype.handleRoutes = function(router,connection,config){
  router.post("/addProductImage",function(req,res){
    var baseUrlPath = config.base_url_server_path;

    var sessionCode = connection.escape(req.body.sessionCode);
    var idProduct = connection.escape(req.body.idProduct);
    var imgbase64 = connection.escape(req.body.imgbase64);
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no paramsreceived..,"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no params received,.,"});
      }else{
        if(imgbase64 == null || imgbase64 == undefined || imgbase64 == ''){
          res.json({"message":"err.. no paramsreceived..,"});
        }else{
          /*TODO: step 0. get count images and check if representation
          *       step 1. get email nya untuk path folder (yang digunakan di path folder=email & idproduct)
          *       step 2. bikin path , dir , dll (kebutuhan save file)
          */
          //step 0.
          var q0 = "select count(id) as count from `gallery_product` where id_product="+idProduct;
          connection.query(q0,function(err,rows){
            if(err){
              res.json({"message":"err.. error on check counts q","q":q0});
            }else{
              if(rows.length>0){
                if(rows[0].count<3){
                  var checkImgCountField = "";
                  var checkImgCountValue = "";
                  if(rows[0].count==0){
                    checkImgCountField+=",isRepresentation";
                    checkImgCountValue+=",1";
                  }

                  //here
                    //step 1.
                  connection.query("select host.email as email,session_host.id_host as id_host from `session_host` join `host` on session_host.id_host=host.id_host where session_host.session_code="+sessionCode,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting host","error":"error"});
                    }else{
                      if(rows.length>0){
                        var email = rows[0].email;
                        var idHost = rows[0].id_host;
                    //step 2.
                        var path = "assets/img/"+email+"/products/product-"+req.body.idProduct;
                        var split1 = imgbase64.split(";");
                        if(split1.length <= 1){
                          res.json({"message":"err.. error imgbase64 invalid format sp1","error":"error"});
                          return;
                        }
                        var split2 = split1[0].split("/");
                        if(split2.length <= 1){
                          res.json({"message":"err.. error imgbase64 invalid format sp2","error":"error"});
                          return;
                        }
                        var ext = split2[1];
                        var imgbase64Only = split1[1].split(",")[1];
                        mkpath.sync(path,function(err){
                          if(err){
                            console.log("message err.. error on sync");
                            res.json({"message":"err.. error on sync"});
                          }else{
                            mkpath(path, function (err) {
                              if (err) {
                                console.log("message err.. error on mkpath");
                                res.json({"message":"err.. error on mkpath"});
                              }else{
                                console.log("Directory structure "+path+" created");//debug
                              }
                            });
                          }
                        });
                        var decodedImage = new Buffer(imgbase64Only, 'base64');
                        var filename = 'product-'+req.body.idProduct+'_'+generateUniqueCode()+'.'+ext;
                        fs.writeFile(path+"/"+filename, decodedImage, function(err) {
                          if(err){
                            console.log("message err.. error in fs.write err:"+err);
                            res.json({"message":"err.. error in fs.write","err":err});
                          }else{
                            // console.log("message success upload img");
                            var imgbase64_database = baseUrlPath+path+"/"+filename;
                            //res.json({"message ":" success upload img","database" : imgbase64_database});

                            connection.beginTransaction(function(err){
                              if (err) {
                                res.json({"message":"err.. error on beginTransaction","error":"error","objErr":err});
                                return;
                              }

                              var q1 = "insert into `gallery_product`(id_product,img_base64"+checkImgCountField+") values("+idProduct+",'"+imgbase64_database+"'"+checkImgCountValue+")";
                              connection.query(q1,function(err,rows){
                                if(err){
                                  connection.rollback(function(){
                                    res.json({"message":"err.. error on updating host with img","q1":q1,"error":"error","objErr":err});
                                    return;
                                  });
                                }else{
                                  // IMG REP HANDLER
                                  if(checkImgCountField){
                                    var qRepHandler = "update `product` set img_rep='"+imgbase64_database+"' where id_product="+idProduct;
                                    connection.query(qRepHandler,function(err,rows){
                                      if(err){
                                        connection.rollback(function(){
                                          res.json({"message":"err.. error on updating product img_rep","qRepHandler":qRepHandler,"error":"error","objErr":err});
                                          return;
                                        });
                                      }else{
                                        var myDate = new Date();
                                        var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                        "-"+myDate.getDate()+" "+myDate.getHours()+
                                        ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                        var q2 = "update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode;
                                        connection.query(q2,function(err,rows){
                                          if(err){
                                            connection.rollback(function(){
                                              res.json({"message":"err.. error on update session last activity","error":"error","objErr":err});
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
                                                res.json({"message":"success updating new value with img","error":"success"});
                                              }
                                            });
                                          }
                                        });
                                      }
                                    });
                                  }else{
                                    var myDate = new Date();
                                    var myTimestamp = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+
                                    "-"+myDate.getDate()+" "+myDate.getHours()+
                                    ":"+myDate.getMinutes()+":"+myDate.getSeconds();
                                    var q2 = "update `session_host` set last_activity='"+myTimestamp+"' where session_code="+sessionCode;
                                    connection.query(q2,function(err,rows){
                                      if(err){
                                        connection.rollback(function(){
                                          res.json({"message":"err.. error on update session last activity","error":"error","objErr":err});
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
                                            res.json({"message":"success updating new value with img","error":"success"});
                                          }
                                        });
                                      }
                                    });
                                  }
                                }
                              });
                            });
                          }
                        });
                      }else{
                        res.json({"message":"err... no rows","error":"invalidSession"});
                      }
                    }
                  });

                }else{
                  res.json({"message":"err.. full images","error":"erorr"});
                }
              }
            }
          });
        }
      }
    }
  });
}

module.exports = addProductImage;
