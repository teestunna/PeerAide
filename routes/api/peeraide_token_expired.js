const mysql = require('mysql');

function TOKEN_EXPIRED_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

TOKEN_EXPIRED_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/token_expired",function(req,res){
        res.render('pages/token_expired', {sentence: "Click on resend to reset password password again now",
                                           confirmation_message: "Session Expired !" });
    });
}

module.exports = TOKEN_EXPIRED_ROUTER;