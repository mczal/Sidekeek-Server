/* DEPRECATED */
var mysql = require('mysql');
//TESTED 27 FEBRUARI 2016
function secondRegister(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

secondRegister.prototype.handleRoutes = function(router,connection){
  router.post("/secondRegister",function(req,res){
    var cat = req.body.idCat;
    var compTitle = req.body.compTitle;
    var threadTitle = req.body.threadTitle;
    var statTemp = req.body.statTemp;
    if(statTemp==null || statTemp==undefined || statTemp==""){
      res.json({"message":"err.. no params !!!","error":"error"});
    }else{
      if(cat==null || cat==undefined || cat==""){
        res.json({"message":"err.. no params categories","error":"error"});
      }else{
        // connection.query("select id_cat from `bussiness_category` where category_name='"+cat+"'",function(err,rows){
          // if(err){
          //   res.json({"message":"err.. error on selectiong idcat from catbussiness","error":"error"});
          // }else{
            // if(rows.length>0){
              // var idCat = rows[0].id_cat;
              if(compTitle==null || compTitle==undefined || compTitle==""){
                res.json({"message":"err.. no params company title","error":"error"});
              }else{
                if(threadTitle==null || threadTitle==undefined || threadTitle==""){
                  res.json({"message":"err.. no params thread title","error":"error"});
                }else{
                  connection.query("update `host_temp`set category="+cat+",company_name='"+compTitle+"',title='"+threadTitle+"' where stat_temp='"+statTemp+"'",function(err,rows){
                    if(err){
                      res.json({"message":"err.. error in updating hosttemp","error":"error"});
                    }else{
                      res.json({"message":"success, proceed next","error":"success"});
                    }
                  });
                }
              }
            // }else{
            //   res.json({"message":"err.. no rows in selecting idcat","error":"error"});
            // }
          // }
        // });
        //----
      }
    }
  });
}

module.exports = secondRegister;
