angular.module('bbsApp')
.controller('datasetCtrl', function($mdSidenav, $stateParams, $state, $http) {
	var self = this;

	self.currentDS;

	self.title;
	self.keyword;
	self.color;

	self.keywordArr = [];

	self.getDataset = function() {
		$http.get('/twitexp/dataset/'+$stateParams.dsID)
		.then(function(res) {
			console.log('Current Dataset: ');
			console.log(res.data);
			self.currentDS = res.data;
			display(false, res.data);
		});
	}

	self.submitNewDS = function() {
		$http.post('/twitexp/newDS', {title: self.title, keys: self.keywordArr})
		.then(function(res) {
			console.log(res.data);
			$state.go('dataset', {dsID: res.data._id});
		});
	}

	self.logKeyword = function() {
		if(!self.color) {
			self.color = '#000';
		}
		self.keywordArr.push({keyText: self.keyword, color: self.color});
		self.keyword = "";
		self.color = "";
		console.log(self.keywordArr);
	}

	self.startDS = function() {
		if(self.currentDS && !self.currentDS.running && !self.currentDS.hasRun) {
			$http.post('/twitexp/startDS', {id: $stateParams.dsID})
			.then(function(res) {
				$('#vis').empty();
				self.getDataset();
			});
		}
	}

	self.stopDS = function() {
		if(self.currentDS && self.currentDS.running && !self.currentDS.hasRun) {
			$http.get('/twitexp/stopDS')
			.then(function(res) {
				$('#vis').empty();
				self.getDataset();
			});
		}
	}

	if($stateParams.dsID) {
		self.getDataset();
	}
});