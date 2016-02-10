var express = require("express"),
	mysql = require("mysql"),
	bodyParser = require("body-parser"),
	md5 = require('MD5'),
  http = require('http'),
	/*(START) BELUM DIPAKAI*/
	fs = require('fs'),
	https = require('https');
	/*(END) BELUM DIPAKAI*/

var firstRegisterModel = require("./model/firstRegister.js");
var secondRegisterModel = require("./model/secondRegister.js");
var signUpModel = require("./model/signUp.js");
var getCitiesModel = require("./model/getCities.js");
var getProvinceModel = require("./model/getProvince.js");
var getCategoriesModel = require("./model/getCategories.js");
var getProfileModel = require("./model/getProfile.js");
var searchModel = require("./model/search.js");
var getIPModel = require("./model/getIP.js");
var loginModel = require("./model/login.js");
var logoutModel = require("./model/logout.js");
var checkModel = require("./model/integrityCheck.js");
//var confirmationModel = require("./model/confirmation.js");
//var editProfileSubmitModel = require("./model/editProfileSubmit.js");

var app = express();
var jwt = require("jsonwebtoken");
app.set('superSecret', 'ilovenode8');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function connect(){
	var self = this;
	self.connectMysql(); //diisi dibawah ...
};

connect.prototype.connectMysql = function() {
	// body...
	var self = this;
    var pool      =    mysql.createPool({ //bisa pake create pool , bisa juga pake mySQL biasa, tapi lebih aman POOL..>>searching
        connectionLimit : 100,
        multipleStatements: true,

		//kalo mau coba local host
		host     : '127.0.0.1',
		user     : 'root',
		password : '',
		database : 'sidekeek',
        datestring : true,
        debug    :  false//console
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);//configurasi otomatis dari express
        }
    });
}

connect.prototype.configureExpress = function(connection) {
	// body...
	var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

        // get an instance of the router for api routes
      var router = express.Router();
      // set /api
        router.post('/auth', function(req, res) {

           // if user is found and password is right
                // create a token
                var token = jwt.sign("user", app.get('superSecret'), {
                  expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });

        });

    // route middleware to verify a token
        router.use(function(req, res, next) {

          // check header or url parameters or post parameters for token
          var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;

          // decode token
          if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
              } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
              }
            });

          } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

          }
        });


      app.use('/sideAPIkeek', router);

			var firstRegister = new firstRegisterModel(router,connection);
			var secondRegister = new secondRegisterModel(router,connection);
			var signUp = new signUpModel(router,connection,md5);
			var getCities = new getCitiesModel(router,connection);
			var getProvince = new getProvinceModel(router,connection);
			var getCategories = new getCategoriesModel(router,connection);
			var getProfile = new getProfileModel(router,connection);
			var search = new searchModel(router,connection);
			var getIP = new getIPModel(router,connection);
			var login = new loginModel(router,connection,md5);
			var logout = new logoutModel(router,connection);
			var check = new checkModel(router,connection);
			//var confirmation = new confirmationModel(router,connection);
			//var editProfileSubmit = new editProfileSubmitModel(router,connection);

			self.startServer();
};

connect.prototype.startServer = function() {
	// body...
	app.listen(3000,function(){
          console.log("magic \"sidekeek\" happend");
      });
};

connect.prototype.stop = function(err) {
	// body...
	console.log("ISSUE WITH MYSQL \n"+ err);
	process.exit(1);
};

new connect();
