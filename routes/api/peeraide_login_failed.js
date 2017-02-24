const mysql = require('mysql');

function USER_NOT_AUTHENTICATED(router) {
    var self = this;
    self.handleRoutes(router);
}

USER_NOT_AUTHENTICATED.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/user_not_authenticated",function(req,res){
        res.render('pages/user_not_found', {error_message: "invalid login credential!", link: "/peeraide/user_login", message: "Try Again!"});
    });
}

module.exports = USER_NOT_AUTHENTICATED;