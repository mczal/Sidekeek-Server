// no login
function feedback(router,connection,sendgrid,config){
  var self=this;
  self.handleRoutes(router,connection,sendgrid,config);
}

feedback.prototype.handleRoutes = function(router,connection,sendgrid,config){
  router.post('/feedback',function(req,res){
    var subject = req.body.subject;
    var email = req.body.email;
    var name = req.body.name;
    var message = req.body.message;
    if(email == null || email == undefined || email == ''){
      res.status(422).json({"message":"err.. error no param e rec","error":"error"});
    }else{
      if(subject == null || subject == undefined || subject == ''){
        res.status(422).json({"message":"err.. error no param s rec","error":"error"});
      }else{
        if(name == null || name == undefined || name == ''){
          res.status(422).json({"message":"err.. error no param n rec","error":"error"});
        }else{
          if(message == null || message == undefined || message == ''){
            res.status(422).json({"message":"err.. error no param m rec","error":"error"});
          }else{
            sendgrid.send({
              to:       config.cs_email,
              from:     email,
              subject:  'Feedback - Customer <Subject : '+subject+'> <From : '+name+'>',
              text:     message,
              html:     "<p>"+message+"</p>",
            }, function(err, json) {
              if (err) {
                res.json({"message":'AAAAAHH!!',"err":err,"error":"error","status":null,"unique_code":null,"email":email,"jsonsgrid":null});
                return console.error(err);
              }
              res.json({"message":"success sending feedback to our customer services","error":"success","status":"feedback","jsonsgrid":json}); //status 0 berarti signup doang
              console.log(json);
            });
          }
        }
      }
    }
  });
}

module.exports = feedback;
