var mysql = require('mysql');

function testingBase64(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

testingBase64.prototype.handleRoutes = function(router,connection){
  router.post('/testingBase64',function(req,res){
    var base64Data = req.body.base64Data;
    res.json({"base64Data":base64Data});
  });
}

module.exports = testingBase64;
