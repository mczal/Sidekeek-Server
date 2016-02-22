var mysql = require('mysql');

function addProductImage(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addProductImage.prototype.handleRoutes = function(router,connection){
  router.post("/addProductImage",function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    var imgBase64 = req.body.imgBase64;

    connection.query("",function(err,rows){

    });
  });
}

module.exports = addProductImage;
