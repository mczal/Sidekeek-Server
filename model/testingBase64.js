var mysql = require('mysql');

function testingBase64(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

testingBase64.prototype.handleRoutes = function(router,connection){
  router.post('/testingBase64',function(req,res){
    var imgbase64 = req.body.imgbase64;
    res.send(imgbase64);
  });
}

module.exports = testingBase64;
