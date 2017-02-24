const config 	= require('../../config/config');
const request 	= require('request');



function PEERAIDE_VALIDATE_RESOURCE(router) {
    var self = this;
    self.handleRoutes(router);
}


PEERAIDE_VALIDATE_RESOURCE.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/approve_resource/:token", function (req,res) {

		var tokenToValidate 		= req.params.token;

		var postData 				= {
      		resourceToken: tokenToValidate
    	}

    	var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/upload_peeraide_resource';
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
      			if(body.grant_type == 'resource successfully added') {
      				/* NOTE: This should be a nice valid page */
      				res.status(200).json({"Error":false, "Message":"You have successfully verified this resource"});
      			} else if(body.grant_type == 'temporary token is invalid'){
      				/* NOTE: This should be an actual error page */
 					res.status(404).json({"Error":true, "Error type":body.grant_type});
      			} else {
      				/* NOTE: This should be an actual error page */
      				res.status(404).json({"Error":true, "Error type":body.grant_type});
      			}
      		}
      	});
	});
}

module.exports = PEERAIDE_VALIDATE_RESOURCE;