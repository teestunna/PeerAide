const request         = require('request');
const NodeCache       = require( "node-cache" );
const peerAideCache   = new NodeCache({stdTTL: 600});

function INDEX_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

INDEX_ROUTER.prototype.handleRoutes = function(router) {
  var self = this;

  router.get("/",function(req,res){
    var univeristies_loaded = peerAideCache.get("univs");

    if(typeof univeristies_loaded === 'undefined') {
      var universities1 = [];
      requestForUniDatas(res, req, universities1);
    } else {
      var peeraideCacheExpiration = peerAideCache.getTtl( "ttlKey" );
      if(typeof peeraideCacheExpiration !== 'undefined') {
        peerAideCache.get("univs", function( err, universitiesReturned) {
          if( !err ){
            if(typeof universitiesReturned === 'undefined'){
              var universities2 = [];
              requestForUniDatas(res, req, universities2);
            }else{
              var universities3 = [];
              if(universitiesReturned.length) {
                for(var i = 0; i < universitiesReturned.length; i++) {
                  if(typeof universitiesReturned[i].university_list !== 'undefined') {
                    universities3.push(universitiesReturned[i].university_list);
                  }
                }
              } else {
                universities3.push("");
              }

              if(typeof req.user === 'undefined') {
                res.render('pages/index', { title: 'PeerAide', peeraide_universities: universities3, users_uploaded_image: "/img/male_user.png"});
              } else {
                res.render('pages/index', { title: 'PeerAide', peeraide_universities: universities3, users_uploaded_image: req.user[0].userImagePath});
              }
            }
          }
        });
      } else {
        var universities4 = [];
        requestForUniDatas(res, req, universities4);
      }
    }
  });
}


function requestForUniDatas(res, req, universities1) {
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
        if(body.universities_returned.length) {
          var success = peerAideCache.set("univs", body.universities_returned, 10000);
          peerAideCache.set( "ttlKey", body.universities_returned );
          
          for(var i = 0; i < body.universities_returned.length; i++) {
            universities1.push(body.universities_returned[i].university_list);
          }
        } else {
          universities1.push("");
        }

        if(typeof req.user === 'undefined') {
          res.render('pages/index', { title: 'PeerAide', peeraide_universities: universities1, users_uploaded_image: "/img/male_user.png"});
        } else {
          res.render('pages/index', { title: 'PeerAide', peeraide_universities: universities1, users_uploaded_image: req.user[0].userImagePath});
        }
      } else {
        /* Render error page indicating something went wrong */
        res.status(404).json({"Error":true, "grant_type":"University not found"});
      }
    }
  });
}

module.exports = INDEX_ROUTER;