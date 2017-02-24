const mysql = require('mysql');

function PEERAIDE_USER_LOGOUT_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

PEERAIDE_USER_LOGOUT_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/user_logout",function (req,res){
        req.logout();
        req.session.destroy();
        res.redirect("/");
    });
}

module.exports = PEERAIDE_USER_LOGOUT_ROUTER;