function COURSE_FIND_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

COURSE_FIND_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/course_search",function (req,res){
        res.render('pages/course_find');
    });
}

module.exports = COURSE_FIND_ROUTER;