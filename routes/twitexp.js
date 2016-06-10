var express = require('express');
var router = express.Router();
var request = require('request');

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

module.exports = router;