const request 	= require('request');

function RESET_PASSWORD_GET_ROUTE(router) {
    var self = this;
    self.handleRoutes(router);
}

RESET_PASSWORD_GET_ROUTE.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/reset_password/:token",function(req,res) {

		var retrieveToken 	= req.params.token;

		var postData 		= {
      		retrievedUserToken: retrieveToken
    	}

    	var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/validate_user_token';
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
      				/* NOTE: we need to fix this page */
      				res.render('pages/token_expired', {sentence: "Click on resend to reset password again now",
                                                   	  confirmation_message: "Session Expired !" });
      			} else if(body.grant_type == 'User token is valid') {
      				res.render('pages/resetpassword');
      			} else if(body.grant_type == 'session expired') {
      				/* Note: We need to fix this page as well */
      				res.render('pages/token_expired', {sentence: "Click on resend to reset password again now",
                                                      confirmation_message: "Session Expired !" });
      			}
      		}
      	});
    });
}

module.exports = RESET_PASSWORD_GET_ROUTE;