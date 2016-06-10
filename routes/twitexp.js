var express = require('express');
var router = express.Router();
var request = require('request');
var TEKEY;

if(process.env.APIKEY) {
	TEKEY = process.env.APIKEY;
}else {
	TEKEY = require('../secrets/apikey');
}

router.route('/dataset/:dsID')
	.get(function(req, res, next) {
		request('http://the-twitter-express.herokuapp.com/api/datasets/'+req.params.dsID, function(err, response, body) {
			res.json(JSON.parse(body));
		});
	});

router.route('/datasets')
	.get(function(req, res, next) {
		request('http://the-twitter-express.herokuapp.com/api/datasets', function(err, response, body) {
			res.json(JSON.parse(body));
		});
	});

router.route('/newDS')
	.post(function(req, res, next) {
		if(currentUser) {
			console.log(req.body);
			request.post({url: 'http://the-twitter-express.herokuapp.com/api/datasets/new?key=' + TEKEY, json: true, body: req.body}, function(err, response, body) {
				console.log(body);
				res.json(body);
			})
		}else {
			console.log('not signed in');
			res.json({msg: "You need to log in"});
		}
	});

router.route('/startDS')
	.post(function(req, res, next) {
		if(currentUser) {
			console.log(req.body);
			request('http://the-twitter-express.herokuapp.com/api/start/'+ req.body.id +'?key='+ TEKEY, function(err, response, body) {
				console.log('Success');
				res.json({msg: 'Success'});
			});
		}else {
			console.log('not signed in');
			res.json({msg: 'You need to log in'});
		}
	});

router.route('/stopDS')
	.get(function(req, res, next) {
		request('http://the-twitter-express.herokuapp.com/api/stop?key=' + TEKEY, function(err, response, body) {
			console.log('stopped');
			res.json({msg: 'Stopped'});
		});
	});

module.exports = router;