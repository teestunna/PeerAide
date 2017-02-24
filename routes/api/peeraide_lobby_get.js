const request 	= require('request');

function USER_LOBBY_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

USER_LOBBY_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/peeraide_lobby", function(req,res) {
		if(req.user) {
    	 res.render('pages/peeraide_lobby', {users_uploaded_image: req.user[0].userImagePath});
    	} else {
    		res.redirect('/peeraide/user_login');
    	}
  	});
}

module.exports = USER_LOBBY_ROUTER;
