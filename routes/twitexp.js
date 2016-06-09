var express = require('express');
var router = express.Router();
var request = require('request');

router.route('/dataset/:dsID')
	.get(function(req, res, next) {
		request('http://localhost:3000/api/datasets/'+req.params.dsID, function(err, response, body) {
			res.json(JSON.parse(body));
		});
	});

router.route('/datasets')
	.get(function(req, res, next) {
		request('http://localhost:3000/api/datasets', function(err, response, body) {
			res.json(JSON.parse(body));
		});
	});

module.exports = router;