const request 	= require('request');
const io 		= require('socket.io');
const config 	= require('../../config/config');


function USER_LOBBY_ROUTER_POST(router) {
    var self = this;
    self.handleRoutes(router);
}

USER_LOBBY_ROUTER_POST.prototype.handleRoutes = function(router) {
	var self = this;

	/* Handle all form requests here also link it to the server */

	/* When a user clicks on join update the number of users currently in the session

	/* Open his own session for him and display all other available messages
}

module.exports = USER_LOBBY_ROUTER_POST;