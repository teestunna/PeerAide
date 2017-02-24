var mysql = require('mysql');

function PEERAIDE_404_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

PEERAIDE_404_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("*", function(req,res) {
        res.render('pages/404', {error_message: "Page not found..", link: "/", message: "Go Home !"});
    });
}

module.exports = PEERAIDE_404_ROUTER;