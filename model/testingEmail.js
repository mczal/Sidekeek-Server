var mysql = require('mysql');
var sendgrid = require('sendgrid')('mczal','Fahrizalsss*123#');

function testingEmail(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

testingEmail.prototype.handleRoutes = function(router,connection){
  router.get('/testingEmail',function(req,res){
    sendgrid.send({
      to:       'fahrizalseptrianto@gmail.com',
      from:     'noreply@sidekeek.co',
      subject:  'First test with my first sendgrid account',
      text:     'My first email through SendGrid.',
      html:     "<a href='http://sidekeek.co/'><button>CLICK  ME!!!!</button></a>"
    }, function(err, json) {
      if (err) {
        res.json({"message":'AAAAAHH!!'});
        return console.error(err);
      }
      res.json({"message":'WOHOOOO!!',"jsonsgrid":json});
      console.log(json);
    });
  });
}

module.exports = testingEmail;
