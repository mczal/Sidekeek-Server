var mysql = require('mysql');

function secondRegister(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

secondRegister.prototype.handleRoutes = function(router,connection){
  router.post("/secondRegister",function(req,res){
    var myId = req.body.myId;
    var cat = req.body.cat;
    var compTitle = req.body.compTitle;
    var threadTitle = req.body.threadTitle;
    if(myId==null || myId==undefined || myId==""){
      res.json({"message":"err.. no params !!!"});
    }else{
      if(cat==null || cat==undefined || cat==""){
        res.json({"message":"err.. no params categories"});
      }else{
        connection.query("select id_cat from `bussiness_category` where category_name='"+cat+"'",function(err,rows){
          if(err){
            res.json({"message":"err.. error on selectiong idcat from catbussiness"});
          }else{
            if(rows.length>0){
              var idCat = rows[0].id_cat;
              if(compTitle==null || compTitle==undefined || compTitle==""){
                res.json({"message":"err.. no params company title"});
              }else{
                if(threadTitle==null || threadTitle==undefined || threadTitle==""){
                  res.json({"message":"err.. no params thread title"});
                }else{
                  connection.query("update `host_temp`set category="+idCat+",company_name='"+compTitle+"',title='"+threadTitle+"' where id_host="+myId,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error in updating hosttemp"});
                    }else{
                      res.json({"message":"success, proceed next"});
                    }
                  });
                }
              }
            }else{
              res.json({"message":"err.. no rows in selecting idcat"});
            }
          }
        });
        //----
      }
    }
  });
}

module.exports = secondRegister;
