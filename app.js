var express = require("express"),
	mysql = require("mysql"),
	bodyParser = require("body-parser"),
	md5 = require('MD5'),
  http = require('http'),
	fs = require('fs'),
	swagger = require("swagger-node-express"),
	sendgrid = require('sendgrid')('mczal','*3tZR#PQYcd');;

var subpath = express();
var isHostModel = require("./model/isHost.js");

var hostSignUpModel = require("./model/registers/hostSignUp.js");
var firstRegisterModel = require("./model/registers/firstRegister.js");
var secondRegisterModel = require("./model/registers/secondRegister.js");
var signUpModel = require("./model/registers/signUp.js");
var getCitiesModel = require("./model/getCities.js");
var getProvinceModel = require("./model/getProvince.js");
var getCategoriesModel = require("./model/getCategories.js");
var resendMailConfirmationCodeModel = require("./model/registers/resendMailConfirmationCode.js");

var getProfileModel = require("./model/profiles/getProfile.js");
var editProfileModel = require("./model/profiles/editProfile.js");
var editAccountModel = require("./model/profiles/editAccount.js");
var getAccountModel = require("./model/profiles/getAccount.js");
var editAccountPicModel = require("./model/profiles/editAccountPic.js");
var requestChangePasswordModel = require("./model/profiles/requestChangePassword.js");
var confirmChangePasswordModel = require("./model/profiles/confirmChangePassword.js");
var addHostReviewModel = require("./model/profiles/addHostReview.js");
var getHostReviewModel = require("./model/profiles/getHostReview.js");

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

var supportModel = require("./model/utilities/support.js");
var feedbackModel = require("./model/utilities/feedback.js");
var contactUsModel = require("./model/utilities/contactUs.js");

var testingEmailModel = require("./model/testingEmail.js");
var testingBase64Model = require("./model/testingBase64.js");
// console.log(process.env.NODE_ENV);
var common = require("./routes/common.js");
var config = common.config();
if(!process.env.NODE_ENV) throw new Error("undefined mode");
// console.log(config.base_url_path);

var app = express();
var jwt = require("jsonwebtoken");
app.set('superSecret', config.supersecret);

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
			app.use("/sidekeek/docs/", subpath);
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
					var emailAuth = req.body.emailAuth;
					var passwordAuth = req.body.passwordAuth;
					if(emailAuth == null || emailAuth == undefined || emailAuth == '' || passwordAuth == null || passwordAuth == undefined || passwordAuth == '' ){
						// if user is found and password is right
                 // create a token
                 var token = jwt.sign({
									 status :"guest",
									 timestamp: new Date()
								 }, app.get('superSecret'), {
                   expiresInMinutes: 1440 // expires in 24 hours
                 });

                 // return the information including token as JSON
                 res.json({
                   error: "success",
                   message: 'Enjoy your token!',
                   token: token,
									 status: 'guest'
                 });
					}else{
						connection.query("select id_host,email,password from `host` where email='"+emailAuth+"'",function(err,rows){
							if(err){
								return res.json({ error: "error", message: 'error get user' });
							}else{
								if(rows.length>0){
									if(rows[0].password == md5(passwordAuth)){
										// create a token
	                  var token = jwt.sign({
											id_host :rows[0].id_host,
											email :rows[0].email,
											password :rows[0].password,
											status :"user",
											timestamp: new Date()
										}, app.get('superSecret'), {
	                    expiresInMinutes: 1440 // expires in 24 hours
	                  });

	                  // return the information including token as JSON
	                  res.json({
	                    error: "success",
	                    message: 'Enjoy your token!',
	                    token: token,
											status: 'user'
	                  });
									}else{
										return res.json({ error: "error", message: 'Failed to authenticate user.' });
									}
								}else{
									res.json({error: "error", message:"Failed to find user"});
								}
							}
						});
					}

        });

				var searchTemplate = new searchTemplateModel(router,connection);
				var search = new searchModel(router,connection);

				var requestChangePassword = new requestChangePasswordModel(router,connection,jwt,sendgrid,app,config);
				var confirmChangePassword = new confirmChangePasswordModel(router,connection,jwt,app,sendgrid,md5);
				var support = new supportModel(router,connection,sendgrid,config);
				var feedback = new feedbackModel(router,connection,sendgrid,config);
				var contactUs = new contactUsModel(router,connection,sendgrid,config);

				var getProfile = new getProfileModel(router,connection);
				var getAccount = new getAccountModel(router,connection);
				var getHostReview = new getHostReviewModel(router,connection);

				var getPortofolioDetail = new getPortofolioDetailModel(router,connection);
				var getPortofolios = new getPortofoliosModel(router,connection);

				var getProducts = new getProductsModel(router,connection);
				var getProductDetail = new getProductDetailModel(router,connection);
				var getProductsEager = new getProductsEagerModel(router,connection);

				var getCities = new getCitiesModel(router,connection);
				var getProvince = new getProvinceModel(router,connection);
				var getCategories = new getCategoriesModel(router,connection);


    // route middleware to verify a token
        router.use(function(req, res, next) {

          // check header or url parameters or post parameters for token
          var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;

          // decode token
          if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
              if (err) {
                return res.status(403).json({ error: "error", message: 'Failed to authenticate token.' });
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
                error: "error",
                message: 'No token provided.'
            });

          }
        });


      app.use('/sideAPIkeek', router);

			var isHost = new isHostModel(router,connection);

			var hostSignUp = new hostSignUpModel(router,connection,md5,config,sendgrid);
			var firstRegister = new firstRegisterModel(router,connection);
			var secondRegister = new secondRegisterModel(router,connection);
			var signUp = new signUpModel(router,connection,md5,config,sendgrid);

			var editProfile = new editProfileModel(router,connection);
			var editAccount = new editAccountModel(router,connection,fs);
			var editAccountPic = new editAccountPicModel(router,connection,config);
			var resendMailConfirmationCode = new resendMailConfirmationCodeModel(router,connection,sendgrid,config);
			var addHostReview = new addHostReviewModel(router,connection);

			var getIP = new getIPModel(router,connection);
			var login = new loginModel(router,connection,md5);
			var logout = new logoutModel(router,connection);
			var check = new checkModel(router,connection);

			var addNewProductDesc = new addNewProductDescModel(router,connection);
			var addProductImage = new addProductImageModel(router,connection,config);
			var confirmation = new confirmationModel(router,connection,jwt,app);
			var editProductImage = new editProductImageModel(router,connection,config);
			// var editProfileFull = new editProfileFullModel(router,connection);

			var addNewPortofolio = new addNewPortofolioModel(router,connection,config);
			var editPortofolio = new editPortofolioModel(router,connection);
			var editProductDesc = new editProductDescModel(router,connection);

			var editPortofolioImg = new editPortofolioImgModel(router,connection,config);

			var deleteProductImage = new deleteProductImageModel(router,connection);
			var deleteProduct = new deleteProductModel(router,connection);
			var deletePortofolio = new deletePortofolioModel(router,connection);

			var testingEmail = new testingEmailModel(router,connection);
			var testingBase64 = new testingBase64Model(router,connection,fs);

			self.startServer();
};

connect.prototype.startServer = function() {
	// body...
	app.listen(config.server_port,function(){
          console.log("\'sidekeek-server\' listening on port:"+config.server_port+" in "+process.env.NODE_ENV+" mode");
      });
};

connect.prototype.stop = function(err) {
	// body...
	console.log("ISSUE WITH MYSQL \n"+ err);
	process.exit(1);
};

new connect();
