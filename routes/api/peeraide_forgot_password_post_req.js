const request = require('request');
const config  = require('../../config/config');

function FORGOT_PASSWORD_POST_ROUTER(router, nodemailer) {
    var self = this;
    self.handleRoutes(router, nodemailer);
}

FORGOT_PASSWORD_POST_ROUTER.prototype.handleRoutes = function(router, nodemailer) {
  var self = this;

  router.post("/peeraide/forgot_password",function(req,res, next) {

    var usersEmail = req.body.email;

    var postData   = {
      email: usersEmail
    }

    var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_users_handler/forgot_my_password';
    var options = {
      method: 'post',
      body:   postData,
      json:   true,
      url:    url
    }

    request(options, function (err, res1, body) {
      if (err) {
        console.log(err);
      } else {
        if(body.grant_type == 'Username/email exists') {
          res.render('pages/user_not_found', {error_message: "user does not exist!", link: "/peeraide/forgotPassword", message: "Go back !"});
        } else if(body.grant_type == 'token generated successfully') {
          var splitTokenAndEmail  = body.user_email_and_token.split("*");
          var userEmail           = splitTokenAndEmail[1];
          var userToken           = splitTokenAndEmail[0];

          var smtpTransport = nodemailer.createTransport({
            service: config.mailService,
            auth: {
              user: config.mailUserName,
              pass: config.mailPassword
            }
          });

          var mailOptions = {
            to:        userEmail,
            from:     'peeraidepasswordreset@peeraide.com',
            subject:  'PeerAide Password Reset',
            text:     'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://' + req.headers.host + '/peeraide/reset_password/' + userToken + '\n\n' +
                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };

          smtpTransport.sendMail(mailOptions, function(err) {
            if(!err) {
              res.render('pages/password_change_email', {sentence: "Kindly check your email and follow the instructions to reset your password",
                                                         confirmation_message: "Email Sent !"});
            } else {
              /* NOTE: Just dislay a random error message returned from body.grant_type */
            }
          });
        } else {
          /* NOTE: Just dislay a random error message returned from body.grant_type */
        }
      }
    });
  });
}

module.exports = FORGOT_PASSWORD_POST_ROUTER;