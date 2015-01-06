var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async'),
    _ = require('underscore'),
    moment = require('moment');


/* GET art home page. */
router.get('/', function(req, res) {   
    res.render('code', {
        title: 'Sierra Katow, Code',
        nav: true,
        links: ['projects', 'designs', 'github'],
    });
});

module.exports = router;
