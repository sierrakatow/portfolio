var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async'),
	_ = require('underscore'),
	moment = require('moment-timezone');

var googleurl = 'https://www.googleapis.com/';
var time = moment().tz("America/Los_Angeles").format();
var req_urls = {
	calendar: 'calendar/v3/calendars/uttvadcqlbvehtnua65g4fuqks@group.calendar.google.com/events?singleEvents=true&orderBy=startTime&timeMin='+time+'&key=AIzaSyDqvITIZ5hTcYqf1M_Q8Ic6IqZ9yUzy9SU',
	videos: 'youtube/v3/playlistItems?part=snippet&playlistId=PLgyUzo9KN5BaZKoCABNWfTSV8cs1simr8&key=AIzaSyDqvITIZ5hTcYqf1M_Q8Ic6IqZ9yUzy9SU'
};



/* GET comedy home page. */
router.get('/', function(req, res) {
	async.parallel({
		'dates': function(callback){
			request(googleurl+req_urls['calendar'], function(err, res, body){
				body = JSON.parse(body);
				var events = _.map(body.items, function(i){
					return {
						title: i.summary,
						location: i.location,
						date: moment(i.start.dateTime, moment.ISO_8601).tz("America/Los_Angeles").format("MMM DD, YYYY"),
						time: moment(i.start.dateTime, moment.ISO_8601).tz("America/Los_Angeles").format("h:mm a"),
						link: i.description
					}
				});
				callback(null, events)
			})
		},
		'videos': function(callback){
			request(googleurl+req_urls['videos'], function(err, res, body){
				body = JSON.parse(body);
				var video_ids = _.map(body.items, function(i){
					return i.snippet.resourceId.videoId;
				});
				callback(null, video_ids)
			})
		}
	}, function(err, results){
		var dates = results['dates'],
			videos = results['videos'];

		res.render('comedy', { 
			title: 'Sierra Katow, Comedian', 
			nav: true,
			links: [ 'bio', 'videos', 'upcoming dates', 'contact' ],
			time: time,
			dates: dates,
			videos: videos
		});
	});

	
});

module.exports = router;
