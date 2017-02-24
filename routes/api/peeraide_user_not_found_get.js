const mysql = require('mysql');

function USER_NOT_FOUND_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

USER_NOT_FOUND_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/user_not_found",function(req,res){
        res.render('pages/user_not_found', {error_message: "User not found...", link: "/peeraide/user_login", message: "Try Again!"});
    });
}

module.exports = USER_NOT_FOUND_ROUTER;