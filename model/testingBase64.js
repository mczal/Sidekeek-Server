var mysql = require('mysql');
var mkpath = require('mkpath');
function testingBase64(router,connection,fs){
  var self=this;
  self.handleRoutes(router,connection,fs);
}

var self=this;

testingBase64.prototype.handleRoutes = function(router,connection,fs){
  router.post('/testingBase64',function(req,res){
    var cars = new Array("Saab", "Volvo", "BMW");
    var myTest = new Array();
    myTest[0] = (cars);
    myTest[1] = (["John", "Doe", 46]);
    myTest[2] = (new Array("Banana", "Orange", "Apple", "Mango"));
    res.json({"myTest":myTest,"length":myTest.length});
  });
}

module.exports = testingBase64;
