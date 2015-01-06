var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async'),
    _ = require('underscore'),
    moment = require('moment');

var googleapis = require('googleapis');

var CLIENT_ID = '453344822855-bnr759u4v96f69oko8c1p07b374nacmp.apps.googleusercontent.com',
    CLIENT_SECRET = 'uhg0JGmgW2GcpFQjBgvlc4Vq',
    REDIRECT_URL = 'YOUR REDIRECT URL HERE',
    SCOPE = 'https://www.googleapis.com/auth/drive.file';

var baseurl = 'https://googledrive.com/host/';

var requrls = {
	'bw': '0B9s2foxH3xzVaE9HOHJETFZhcWM',
	'color': '0B9s2foxH3xzVaVF0MEZVaVBPRFk',
	'digital': '0B9s2foxH3xzVeHhEODhzczhPWUk'
}

/* GET art home page. */
router.get('/', function(req, res) {
	async.parallel(_.map(_.keys(requrls), function(k){
		return function(callback){
			request(baseurl+requrls[k]+'/', function(err, resp, body){
				if(!err){
					var matches = body.match(/\/host\/([A-Za-z0-9/%-\._&#;])+/g);
					callback(null, _.map(matches, function(m){ return 'https://googledrive.com'+m; }));
				}else{
					//console.log(baseurl+requrls[k]+endurl);
					console.log(k+' Failed');
					callback(k+' Failed', null);
				}
			})
		}
	}), function(err, result){
		if(err) console.log(err);
		res.render('art', {
			title: 'Sierra Katow, Artwork',
			nav: true,
			links: ['grayscale', 'color', 'digital'],
			bw: result[0],
			color: result[1],
			digital: result[2]
		});
	});
});

module.exports = router;
