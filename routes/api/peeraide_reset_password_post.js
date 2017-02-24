const request   = require('request');

function RESET_PASSWORD_POST_ROUTE(router) {
    var self = this;
    self.handleRoutes(router);
}

RESET_PASSWORD_POST_ROUTE.prototype.handleRoutes = function(router) {
	var self = this;

	router.post("/peeraide/reset_password/:token",function(req,res) {

		var retrieveToken = req.params.token;
    var newPassword   = req.body.new_password;

    var postData = {
      userUniqueToken: retrieveToken,
      userPassword:    newPassword 
    }

    var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_users_handler/reset_user_password';
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
        if(body.grant_type == 'User token is invalid') {
          /* Note: This will be switched to our general custom error page */
          res.status(404).json({"Error":true, "Message":"User token is invalid"});
        } else if(body.grant_type == 'session expired'){
          /* Note: This will be switched to our general custom error page */
          res.status(404).json({"Error":true, "Message":"Session expired!"});
        } else if(body.grant_type == 'password has been sucessfully reset') {
          res.render('pages/pwsd_change_success', {sentence: "Your password has been successfully changed you can login now", 
                                                  confirmation_message: "Success !" }); 
        }
      }
    });
  });
}

module.exports = RESET_PASSWORD_POST_ROUTE;