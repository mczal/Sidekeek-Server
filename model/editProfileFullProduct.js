var mysql = require('mysql');

function editProfileFullProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

editProfileFullProduct.prototype.handleRoutes = function(router,connection){
  router.post("/editProfileFullProduct",function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    var imgBase64 = req.body.imgBase64;

    connection.query("",function(err,rows){

    });
  });
}

module.exports = editProfileFullProduct;
