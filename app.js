var express = require("express"),
	mysql = require("mysql"),
	bodyParser = require("body-parser"),
	md5 = require('MD5'),
  http = require('http'),
	/*(START) BELUM DIPAKAI*/
	fs = require('fs');
	swagger = require("swagger-node-express");
	/*(END) BELUM DIPAKAI*/

var subpath = express();
var isHostModel = require("./model/isHost.js");

var hostSignUpModel = require("./model/registers/hostSignUp.js");
var firstRegisterModel = require("./model/registers/firstRegister.js");
var secondRegisterModel = require("./model/registers/secondRegister.js");
var signUpModel = require("./model/registers/signUp.js");
var getCitiesModel = require("./model/getCities.js");
var getProvinceModel = require("./model/getProvince.js");
var getCategoriesModel = require("./model/getCategories.js");

var getProfileModel = require("./model/profiles/getProfile.js");
var editProfileModel = require("./model/profiles/editProfile.js");
var editAccountModel = require("./model/profiles/editAccount.js");
var getAccountModel = require("./model/profiles/getAccount.js");
var editAccountPicModel = require("./model/profiles/editAccountPic.js");

var searchTemplateModel = require("./model/search/search-template.js");

var searchModel = require("./model/search/search.js");
var getIPModel = require("./model/getIP.js");
var loginModel = require("./model/login.js");
var logoutModel = require("./model/logout.js");
var checkModel = require("./model/integrityCheck.js");

var getProductsModel = require("./model/products/getProducts.js");
var getProductDetailModel = require("./model/products/getProductDetail.js");
var addNewProductDescModel = require("./model/products/addNewProductDesc.js");
var addProductImageModel = require("./model/products/addProductImage.js")
var editProductImageModel =require("./model/products/editProductImage.js");
var confirmationModel = require("./model/registers/confirmation.js");
// var editProfileFullModel = require("./model/editProfileFull.js");

var addNewPortofolioModel = require("./model/portofolios/addNewPortofolio.js");
var getPortofoliosModel = require("./model/portofolios/getPortofolios.js");
var editPortofolioModel = require("./model/portofolios/editPortofolio.js");
var editProductDescModel = require("./model/products/editProductDesc.js");
var getPortofolioDetailModel = require("./model/portofolios/getPortofolioDetail.js");
var getProductsEagerModel = require("./model/products/getProductsEager.js");
var editPortofolioImgModel = require("./model/portofolios/editPortofolioImg.js");

var deleteProductImageModel = require("./model/products/deleteProductImage.js");
var deleteProductModel = require("./model/products/deleteProduct");
var deletePortofolioModel = require("./model/portofolios/deletePortofolio.js");

var testingEmailModel = require("./model/testingEmail.js");
var testingBase64Model = require("./model/testingBase64.js");

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
        multipleStatements: false,

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
			// app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true,limit: '5mb' }));
			app.use(express.static('dist'));
			app.use("/sidekeek/docs", subpath);
			swagger.setAppHandler(subpath);
			// swagger.setApiInfo({
		  //   title: "example API",
		  //   description: "API to do something, manage something...",
		  //   termsOfServiceUrl: "",
		  //   contact: "yourname@something.com",
		  //   license: "",
		  //   licenseUrl: ""
			// });
			subpath.get('/', function (req, res) {
		    res.sendFile(__dirname + '/dist/index-docs.html');
			});
			// swagger.configureSwaggerPaths('', 'api-docs', '');
			// var domain = 'localhost';
			// var prt = 3000;
			// if(argv.domain !== undefined)
			//     domain = argv.domain;
			// else
			// console.log('No --domain=xxx specified, taking default hostname "localhost".');
			// var applicationUrl = 'http://' + domain+":"+prt+"/sidekeek";
			// console.log(applicationUrl);
			// swagger.configure(applicationUrl, '1.0.0');

      // app.use(bodyParser.json({limit: '5mb'}));

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

			var isHost = new isHostModel(router,connection);

			var hostSignUp = new hostSignUpModel(router,connection,md5);
			var firstRegister = new firstRegisterModel(router,connection);
			var secondRegister = new secondRegisterModel(router,connection);
			var signUp = new signUpModel(router,connection,md5);
			var getCities = new getCitiesModel(router,connection);
			var getProvince = new getProvinceModel(router,connection);
			var getCategories = new getCategoriesModel(router,connection);

			var getProfile = new getProfileModel(router,connection);
			var editProfile = new editProfileModel(router,connection);
			var editAccount = new editAccountModel(router,connection,fs);
			var getAccount = new getAccountModel(router,connection);
			var editAccountPic = new editAccountPicModel(router,connection);

			var searchTemplate = new searchTemplateModel(router,connection);

			var search = new searchModel(router,connection);
			var getIP = new getIPModel(router,connection);
			var login = new loginModel(router,connection,md5);
			var logout = new logoutModel(router,connection);
			var check = new checkModel(router,connection);

			var getProducts = new getProductsModel(router,connection);
			var getProductDetail = new getProductDetailModel(router,connection);
			var addNewProductDesc = new addNewProductDescModel(router,connection);
			var addProductImage = new addProductImageModel(router,connection);
			var confirmation = new confirmationModel(router,connection);
			var editProductImage = new editProductImageModel(router,connection);
			// var editProfileFull = new editProfileFullModel(router,connection);

			var addNewPortofolio = new addNewPortofolioModel(router,connection);
			var getPortofolios = new getPortofoliosModel(router,connection);
			var editPortofolio = new editPortofolioModel(router,connection);
			var editProductDesc = new editProductDescModel(router,connection);
			var getPortofolioDetail = new getPortofolioDetailModel(router,connection);
			var getProductsEager = new getProductsEagerModel(router,connection);
			var editPortofolioImg = new editPortofolioImgModel(router,connection);

			var deleteProductImage = new deleteProductImageModel(router,connection);
			var deleteProduct = new deleteProductModel(router,connection);
			var deletePortofolio = new deletePortofolioModel(router,connection);

			var testingEmail = new testingEmailModel(router,connection);
			var testingBase64 = new testingBase64Model(router,connection,fs);

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
