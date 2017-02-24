function CUSTOM_LOGIN_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

CUSTOM_LOGIN_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/user_login",function (req,res){
        res.render('pages/custom_login');
    });
}

module.exports = CUSTOM_LOGIN_ROUTER;