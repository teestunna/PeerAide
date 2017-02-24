const request = require('request');


function AUTHENTICATED_SIGN_UP(router) {
    var self = this;
    self.handleRoutes(router);
}

AUTHENTICATED_SIGN_UP.prototype.handleRoutes = function(router) {
	var self = this;

	router.post("/peeraide_api/signup_user",function(req,res) {

        var userName    = req.body.actual_username;
        var userEmail   = req.body.email;
        var uPassword   = req.body.pwd;
        var uGender     = req.body.gender;
        var fName       = req.body.firstName;
        var lName       = req.body.lastName;

        var postData    = {
            firstname:  fName,
            lastname:   lName,
            email:      userEmail,
            username:   userName,
            password:   uPassword,
            gender:     uGender
        }

        var url = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_users_handler/register_user_peeraide'
        var options = {
            method: 'post',
            body:   postData,
            json:   true,
            url:    url
        }

        request(options, function (err, res1, body) {
            if (err) {
                console.log(err);
            } else {
                if(body.grant_type == 'user successfully added to db!') {
                    res.status(200).json({"Error" : false, "Message" : "user successfully added to db!"});
                } else if(body.grant_type == 'Username/email exists') {
                    res.status(404).json({"Error":true, "Message":"username or email exists"});
                }
            }
        });
    });
}

module.exports = AUTHENTICATED_SIGN_UP;