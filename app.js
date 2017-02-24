const express            = require('express');
const http			         = require('http');
const path 			         = require('path');
const bodyParser  	     = require("body-parser");
const cookieParser       = require('cookie-parser');
const nodemailer         = require('nodemailer');
const session            = require('express-session');
const passport           = require('passport');
const LocalStrategy      = require('passport-local').Strategy;
const crypto             = require('crypto');
const multer             = require('multer');
const compression        = require('compression');
const index_route 	     = require('./routes/index');
const user_sign_in       = require('./routes/api/authenticatedSignIn');
const user_sign_up       = require('./routes/api/signupuser_peeraide');
const search_course	     = require('./routes/api/peeraide_search_courses_api');
const reset_passwrd_get  = require("./routes/api/peeraide_reset_password_get.js");
const reset_passwrd_post = require('./routes/api/peeraide_reset_password_post');
const forgot_paswrd_gReq = require('./routes/api/peeraide_forgot_password_get_req');
const forgot_paswrd_pReq = require('./routes/api/peeraide_forgot_password_post_req');
const custom_login_gReq  = require('./routes/api/peeraide_custom_login_get');
const user_not_found_gR  = require('./routes/api/peeraide_user_not_found_get');
const user_profile_get   = require('./routes/api/peeraide_user_profile_get');
const peeraide_lobby_get = require('./routes/api/peeraide_lobby_get');
const token_expired_gR   = require('./routes/api/peeraide_token_expired');
const error_page_404     = require('./routes/peeraide_404_error');
const user_veri_failed   = require('./routes/api/peeraide_login_failed');
const user_logged_out    = require('./routes/api/peeraide_user_logout');
const user_upload_image  = require('./routes/api/peeraide_upload_user_image_post');
const user_upload_res    = require('./routes/api/peeraide_upload_resources');
const approve_resource   = require('./routes/api/peeraide_validate_resource');
const course_search      = require('./routes/api/peeraide_course_find');
const config             = require('./config/config');
const app  			         = express();


function SERVER_API() {
    var self = this;
    self.configureExpress();
};


SERVER_API.prototype.configureExpress = function() {

	var self = this;

  app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');

  /* body parser middleware */
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser())
  app.use(compression());

  /* Setting the static folder */
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 /* 1d */ }));

  /* Middleware for express session */
  app.use(session({
    secret: config.middWareSecretKey,
    saveUninitialized: true,
    resave: true
  }));

  /* passport initialization */
  app.use(passport.initialize());
  app.use(passport.session());

  /* global vars */
  app.use(function(req, res, next) {
    res.locals.user     = req.user || null;
    res.locals.config   = config;
    next();
  });

  app.use(function (req, res, next) {
    if (req.url.match(/^\/(css|js|img|font)\/.+/)) {
      res.setHeader('Cache-Control', 'public, max-age=86400000');
    }
    next();
  });

  var router = express.Router();

  app.use('/', router);
  var index_router = new index_route(router);

  app.use('/peeraide_api', router);
  var sign_up_user                        = new user_sign_up(router);
  var sign_in_users                       = new user_sign_in(router);
  var peer_aide_course_search_api         = new search_course(router);
  var peer_aide_forgot_password_get_req   = new forgot_paswrd_gReq(router);
  var peer_aide_forgot_password_post_req  = new forgot_paswrd_pReq(router, nodemailer);
  var peer_aide_reset_password_get        = new reset_passwrd_get(router);
  var peer_aide_reset_password_post       = new reset_passwrd_post(router);
  var peer_aide_custom_login_get          = new custom_login_gReq(router);
  var peer_aide_user_is_not_found         = new user_not_found_gR(router);
  var peer_aide_token_expired             = new token_expired_gR(router);
  var peer_aide_user_profile_get          = new user_profile_get(router);
  var peer_aide_peeraide_lobby_get        = new peeraide_lobby_get(router);
  var peeraide_user_verification_failed   = new user_veri_failed(router);
  var peeraide_user_log_out               = new user_logged_out(router);
  var peeraide_user_upload_image_post     = new user_upload_image(router);
  var peeraide_user_upload_resources      = new user_upload_res(router, nodemailer);
  var peeraide_approve_resource           = new approve_resource(router);
  var peeraide_courses_find               = new course_search(router);

  /* 404 Page */
  var peer_aide_error_page                = new error_page_404(router);
  self.startServer();
}


SERVER_API.prototype.startServer = function() {

	http.createServer(app).listen(app.get('port'), function(){
  		console.log('I am now Listening on port ' + app.get('port'));
	});
}

new SERVER_API();
