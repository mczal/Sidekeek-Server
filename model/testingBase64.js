var mysql = require('mysql');
var mkpath = require('mkpath');
function testingBase64(router,connection,fs){
  var self=this;
  self.handleRoutes(router,connection,fs);
}

var self=this;

testingBase64.prototype.handleRoutes = function(router,connection,fs){
  router.post('/testingBase64',function(req,res){
    var imgBase64 = req.body.imgBase64;
    var split = imgBase64.split(";")[0].split("/");
    var ext = split[1];
    mkpath.sync('assets/img',function(err){
      if(err){
        console.log("message err.. error on sync");
        res.json({"message":"err.. error on sync"});
      }else{
        mkpath('assets/img', function (err) {
          if (err) {
            console.log("message err.. error on mkpath");
            res.json({"message":"err.. error on mkpath"});
          }else{
            console.log('Directory structure assets/img created');//debug
          }
        });
      }
    });
    var decodedImage = new Buffer(imgBase64, 'base64');
    fs.writeFile('assets/img/image_decoded.'+ext, decodedImage, function(err,k) {
      if(err){
        console.log("message err.. error in fs.write err:"+err);
        res.json({"message":"err.. error in fs.write","err":err});
      }else{
        console.log("message success upload img");
        res.json({"message":"success upload img"});
      }
    });
  });
}

module.exports = testingBase64;
