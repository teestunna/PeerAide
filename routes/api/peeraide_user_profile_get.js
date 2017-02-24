const NodeCache       = require( "node-cache" );
const peerAideCache   = new NodeCache({stdTTL: 600});
const config          = require('../../config/config');
const request         = require('request');

function USER_PROFILE_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

USER_PROFILE_ROUTER.prototype.handleRoutes = function(router) {
	var self = this;

	router.get("/peeraide/user_profile", isUserAutenticated, function(req,res) {

		var userLoggedIn  = req.user[0].timeUserLoggedIn;
		var currentTime	  = Date.now();

    var url           = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/generate_quotes';
    var options       = {
      method: 'get',
      json:   true,
      url:    url
    }

    request(options, function (err, res1, body) {
      if (err) {
        console.log(err);
      } else {
      	if(body.grant_type == 'quote generated') {
      		var quoteee 		    = body.quote.split("*");
      		var actual_quote 	  = quoteee[0];
      		var author_of_quote = quoteee[1];

      		if(currentTime > userLoggedIn) {
						res.redirect('/peeraide/user_login');
					} else {
            peerAideCache.get("universities_for_profile_page", function (err, universitiesReturned) {
              if( !err ){
                if(typeof universitiesReturned === 'undefined'){
                  requestForUniversities(function(err, universities) {
                    if(!err) {
                      render_page_with_full_creds (req, res, universities, actual_quote, author_of_quote);
                    } else {
                      /* NOTE error should be displayed on error page */
                    }
                  });
                }else{
                  var universities = [];
                  if(universitiesReturned.length) {
                    for(var i = 0; i < universitiesReturned.length; i++) {
                      if(typeof universitiesReturned[i].university_list !== 'undefined') {
                        universities.push(universitiesReturned[i].university_list);
                      }
                    }
                  } else {
                    universities.push("");
                  }
                  render_page_with_full_creds (req, res, universities, actual_quote, author_of_quote);
                }
              }
            });
        	}
      	}
      }
    });
  });
}


function requestForUniversities(callback) {
  var url                     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/grab_list_of_univeristies';
  var options                 = {
    method:'get',
    json: true,
    url: url
  }

  request(options, function(err, res1, body) {
    if(err) {
      console.log(err);
    } else {
      if(body.grant_type == 'univeristy found') {
        var universities = [];
        if(body.universities_returned.length) {
          var success = peerAideCache.set("universities_for_profile_page", body.universities_returned, 10000);
          peerAideCache.set( "ttlKey", body.universities_returned );
          
          for(var i = 0; i < body.universities_returned.length; i++) {
            universities.push(body.universities_returned[i].university_list);
          }
        } else {
          universities.push("");
        }
        callback(null, universities);
      } else {
        callback(body.grant_type, null);
      }
    }
  });
}


function load_resources_uploaded(userEmail, callback) {
  var postData        = {
    email: userEmail
  }

  var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/list_of_resources_uploaded';
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
      if(body.grant_type == 'list of resources uploaded successfully returned') {
        callback(null, body.data_returned);
      } else {
        callback(body.grant_type, null);
      }
    }
  });
}


function render_page_with_full_creds (req, res, universities, actual_quote, author_of_quote) {
  load_resources_uploaded(req.user[0].email, function(err, dataReturned) {
    if(err) {
      /* NOTE error should be displayed on error page */
      res.status(404).json({"Error":true, "Error_type":err});
    } else {
      totalPoint = dataReturned.length * config.pointsEarned;

      res.render('pages/user_profile', {users_uploaded_image: req.user[0].userImagePath,
        quote_of_the_day: actual_quote,
        author_of_the_days_quote: author_of_quote,
        peeraide_universities: universities,
        resource_uploaded: dataReturned,
        points_earned: totalPoint
      });
    }
  });
}

function isUserAutenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/peeraide/user_login');
	}
}

module.exports = USER_PROFILE_ROUTER;