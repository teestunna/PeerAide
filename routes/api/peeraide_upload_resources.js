const config 		= require('../../config/config');
const helper  		= require('../../public/js/peeraide_helper');
const shortid 		= require('shortid');
const multer 		= require('multer');
const multerS3  	= require('multer-s3');
const aws       	= require('aws-sdk');
const request   	= require('request');


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
    	contentType:  multerS3.AUTO_CONTENT_TYPE,
    	storageClass: 'REDUCED_REDUNDANCY',
    	key: function (req, file, cb) {
    		var courseDep 		= req.body.courseDep;
     		var courseC   		= req.body.courseCode;
     		var resourceY 		= req.body.resourceYear;
    		cb(null, "peeraide_resources/"+courseDep.toUpperCase() + "_" + courseC + "/" + courseDep + "_" + courseC + "_" + resourceY + ".pdf");
    	}
	}),

  	fileFilter: function (req, file, cb) {
    	if (file.mimetype !== 'application/pdf') {
      		req.fileExtensionValidation = 'Wrong file extension';
      		return cb(null, false, new Error('Wrong file extension'));
    	}
    	cb(null, true);
  	},

  	limits: { fileSize: config.maxSize } 
}).single('resource');


function UPLOAD_USER_RESOURCE(router, nodemailer) {
    var self = this;
    self.handleRoutes(router, nodemailer);
}


UPLOAD_USER_RESOURCE.prototype.handleRoutes = function(router, nodemailer) {
	var self = this;

	router.post("/peeraide/user_resources_upload", function(req,res){
		upload(req, res, function(err) {
			if (err) {
        		if (err.code === 'LIMIT_FILE_SIZE') {
        			/* Error Page needed */
            		res.status(404).json({"Error":true, "Error_type":"File too Large! Upload file below 4MB"});
        		} else {
            		res.status(404).json({"Error":true, "Error_type":err});
        		}
        	} else {
				if(req.fileExtensionValidation) {
	       			/* Note change this to a decent page showing this error */
	        		return res.end(req.fileExtensionValidation);
	     		} else {
	        		if(typeof req.file === 'undefined') {
	        			/* NOTE: Need a page to send them back to the profile page to do the process all over again */
	        			res.end('Empty file Error!');
	        		} else {
	        			var courseDep 		= req.body.courseDep;
	     	 			var courseC   		= req.body.courseCode;
	     	 			var resourceY 		= req.body.resourceYear;
	     	 			var profN 			= req.body.prof_name.split(" ");
	     	 			var profFName 		= profN[0];
	     	 			var profLName 		= profN[1];
	     	 			var pNameActual 	= profFName + "_" + profLName;
	     	 			var suggestedUni 	= req.body.unis.split(" ");
	     	 			var atctualUni 		= suggestedUni[0] + "_" + suggestedUni[1];

	        			var resourceName 	= courseDep + "_" + courseC + "_" + resourceY + ".pdf";
	          			var resN        	= replaceSpacesWithPlusSigns(resourceName);
	          			var resourcePath    = config.amazonResourcePath +"/" + courseDep.toUpperCase() + "_" + courseC + "/" +resN;

	          			var dateUploaded  	= new Date();
	          			var get_m           = helper.getMonth_PeerAide(dateUploaded.getMonth());
	  					var get_y           = dateUploaded.getFullYear();
						var get_d           = dateUploaded.getDate();
						var date_format     = get_m + "_" + get_d + "_" + get_y;

						var userTok 		= shortid.generate();

	          			var postData 		= {
				      		temporaryResourceName: courseDep,
				      		temporaryResourceCode: courseC,
				      		temporaryResourceYear: resourceY,
				      		temporaryProfessorForResource: pNameActual,
				      		temporaryUniUploadedRes: atctualUni,
				      		temporaryLinkToResource: resourcePath,
				      		temporaryUsernameForRes: req.user[0].email,
				      		temporaryDateUploadedRes: date_format,
				      		temporaryToken: userTok
				    	}

				    	var url     = 'https://peeraide.herokuapp.com/peeraide_api/peeraide_basic_functionality/save_resource_info_temporarily';
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
				      			if(body.grant_type == 'resource temporarily added') {

				      				var smtpTransport = nodemailer.createTransport({
							            service: config.mailService,
							            auth: {
							              user: config.mailUserName,
							              pass: config.mailPassword
							            }
							       	});

				      				var mailOptions = {
							            to:        config.peeraideEmail,
							            from:     'peeraideresource.management@peeraide.com',
							            subject:  'PeerAide Confirm Resource',
							            text:     "You are receiving this email because a student has requested to add a resource to PeerAide resource catalogs .\n\n\n" +
							                      "Below are the details of the course and a link to access the resource: \n" +
							                      "COURSE DEP: " + courseDep + ",\n" +
							                      "COURSE CODE: " + courseC + ",\n" +
							                      "RESOURCE YEAR: " + resourceY + ",\n" +
							                      "RESOURCE LINK: " + resourcePath + "\n" +
							                      "PROF FOR RESOURCE: " + profN + ",\n" +
							                      "SUGGESTED UNI: " + suggestedUni + ",\n\n" +
							                      "LINK TO ADD RESOURCE: " + 'http://' + req.headers.host + '/peeraide/approve_resource/' + userTok
							       	};

				          			smtpTransport.sendMail(mailOptions, function(err) {
				            			if(!err) {
				              				/* NOTE: We will need a page for the success message */
				              				res.status(200).json({"Error":false, "Message": "Thank you for uploading a resource, our management team will review the resource uploaded and approve accordingly" + "\n" + "If it meets the standard of our resources."})
				            			} else {
				              				/* NOTE: Just dislay a random error message returned from body.grant_type */
				              				res.status(404).json({"Error":true, "Message":err}); 
				            			}
				          			});
				      			} else {
				      				/* NOTE: We need an error page to display error here */
				      				res.status(404).json({"Error":true, "grant_type":body.grant_type});
				      			}
				      		}
				      	});
	          		}
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

module.exports = UPLOAD_USER_RESOURCE;