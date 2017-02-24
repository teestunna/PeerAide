const mysql = require('mysql');

function FORGOT_PASSWORD_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

FORGOT_PASSWORD_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/forgotPassword",function(req,res){
        res.render('pages/forgotPassword');
    });
}

module.exports = FORGOT_PASSWORD_ROUTER;