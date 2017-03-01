

// -- DEPRECATED --//
function getIP(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getIP.prototype.handleRoutes = function(router,connection){
  router.get("/getIP",function(req,res){
    var ip = req.header('x-forwarded-*');
     if(ip==null || ip==undefined || ip=="" ){
       res.json({"message":"no"});
     }else{
       res.json({"ip":ip});
     }
  });
}

module.exports = getIP;
