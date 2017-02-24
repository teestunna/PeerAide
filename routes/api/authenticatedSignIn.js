const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const request         = require('request');

function AUTHENTICATED_SIGN_IN(router) {
    var self = this;
    self.handleRoutes(router);
}


AUTHENTICATED_SIGN_IN.prototype.handleRoutes = function(router) {

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },

    function(email, password, done) {

        var postData    = {
            username:       email,
            userPassword:   password
        }

        var url         = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_users_handler/authenticate_user_into_session';
        var options     = {
            method: 'post',
            body:   postData,
            json:   true,
            url:    url
        }

        request(options, function (err, res1, body) {
            if (err) {
                console.log(err);
            } else {
                if(body.grant_type == 'user credentials valid') {
                    return done(null, body.user_data);
                } else if(body.grant_type == 'User not found') {
                    return done(null, false, {"Error": true, "Message" : "User not found"}); 
                } else if(body.grant_type == 'incorrect password entered') {
                    return done(null, false, {"Eror" : true, "Message" : "Incorrect email or password!"});
                }
            }
        });
    }));

    /* Serialize the user for the session */
    passport.serializeUser(function(user, done) {
        done(null, user.stu_id);
    });

    /* Deserialize the user */
    passport.deserializeUser(function(id, done) {

        var postData = {
            studID: id
        }

        var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/validate_user_id';
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
                if(body.grant_type == 'student ID valid') {
                    done(null, body.user_data);
                } else if(body.grant_type == 'student ID invalid'){
                    done(body.grant_type, null);
                }
            }
        });
    });

    router.post("/peeraide_api/signin_user", 
        passport.authenticate('local-login', {successRedirect:'/peeraide/user_profile', failureRedirect:'/peeraide/user_not_authenticated'}));
}

module.exports = AUTHENTICATED_SIGN_IN;