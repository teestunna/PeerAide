var config = {};

config.buffSize 					= 64;
config.numberOfTries 				= 7000;
config.bitsToGenerateForPassword 	= 32;
config.bitsToGenerateForSalt 		= 16;
config.expirationTime				= 3600000;
config.startOfWinter				= 0;
config.endOfWinter					= 4;
config.startOfFall					= 7;
config.endOfFall					= 11;
config.pointsEarned 				= 200;
config.maxSize 						= 4 * 1000 * 1000;

config.minLowRated					= 0.0;
config.maxLowRated					= 2.49;
config.minAverageRated				= 2.5;
config.maxAverageRated				= 3.9;
config.minExcellentRated			= 4.0;
config.maxExcellentRated			= 5.0;

config.poorlyRatedColor				= "#DE4343";
config.averagelyRatedColor			= "#DAAC4B";
config.excellentlyRatedColor		= "#3D944C";

config.amazonSecretAccessKey		= "PvJ8u2Y6rU5+HjcbN13d5PB44WItdXLUdZwpRi0v";
config.amazonAccessKeyID 			= "AKIAJG2WUSMWR5IXHV3A";
config.amazonRegion 				= "us-east-1";
config.amazonSignatureVersion		= "v4";
config.peerAideAmazonBucket    		= "peeraide";
config.amazonCacheMaxAge 			= "max-age=31536000";
config.amazonImagePath 				= "https://s3.ca-central-1.amazonaws.com/peeraide/peeraide_images";
config.amazonResourcePath   		= "https://s3.ca-central-1.amazonaws.com/peeraide/peeraide_resources";

config.maleUser						= "Male";
config.femaleUser					= "Female";

config.mailService 					= "SendGrid";
config.mailUserName 				= "peeraide";
config.mailPassword 				= "Peeraide16";

config.middWareSecretKey			= "peeraide_secret";
config.secret 						= "peeraidetoassiststudents";

config.peeraideEmail 				= "chukwudiimichael@yahoo.ca";

config.tempForPush 					= "";

module.exports = config;