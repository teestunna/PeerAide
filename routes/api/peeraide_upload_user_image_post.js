const multer 	  = require('multer');
const config    = require('../../config/config');
const multerS3  = require('multer-s3');
const aws       = require('aws-sdk');
const request   = require('request');

aws.config.update({
  secretAccessKey:  config.amazonSecretAccessKey,
  accessKeyId:      config.amazonAccessKeyID,
  signatureVersion: config.amazonSignatureVersion,
  region:           config.amazonRegion
});

const s3   = new aws.S3();

var upload = multer({
  storage: multerS3({
    acl:          'public-read',
    s3:           s3,
    bucket:       config.peerAideAmazonBucket,
    cacheControl: config.amazonCacheMaxAge,
    storageClass: 'REDUCED_REDUNDANCY',
    key: function (req, file, cb) {
      cb(null, "peeraide_images/" + req.user[0].username + "/" + req.user[0].username + "_" + file.originalname); //use Date.now() for unique file keys
    }
  }),

  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      req.fileExtensionValidation = 'Wrong file extension';
      return cb(null, false, new Error('Wrong file extension'));
    }
    cb(null, true);
  } 
}).single('image');


function UPLOAD_USER_IMAGE(router) {
    var self = this;
    self.handleRoutes(router);
}


UPLOAD_USER_IMAGE.prototype.handleRoutes = function(router) {
	var self = this;

	router.post("/peeraide/user_image_upload", function(req,res){

		upload(req, res, function(err) {
			if(req.fileExtensionValidation) {
        /* Note change this to a decent page showing this error */
        return res.end(req.fileExtensionValidation);
      } else {
        if(typeof req.file === 'undefined') {
        	/* NOTE: Need a page to send them back to the profile page to do the process all over again */
        	res.end('Empty file Error!');
        } else {
        	var imageName 	= req.user[0].username + "_" + req.file.originalname ;
          var uEmail      = req.user[0].email;
          var imgN        = replaceSpacesWithPlusSigns(imageName);
          var imgPath     = config.amazonImagePath + "/" +req.user[0].username + "/"+imgN;
            
          var postData = {
            email:      uEmail,
            imagePath:  imgPath
          }

          var url1      = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/upload_user_image';
          var options   = {
            method: 'post',
            body:   postData,
            json:   true,
            url:    url1
          }

          request(options, function (err, res1, body) {
            if (err) {
              console.log(err);
            } else {
              if(body.grant_type == 'user image saved') {
                res.redirect('/peeraide/user_profile');
              } else {
                /* Just display an error occured on a page and let them know to try again */
              }
            }
          });
        }
      }
    });
  });
}


function replaceSpacesWithPlusSigns(imagePath) {
  var result = "";
  for(var i = 0; i < imagePath.length; i++) {
    if(imagePath.charAt(i) != " ") {
      result += imagePath.charAt(i);
    } else if(imagePath.charAt(i) == " "){
      result += "+";
    }
  }
  return result;
}

module.exports = UPLOAD_USER_IMAGE;