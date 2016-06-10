angular.module('bbsApp')
.controller('datasetCtrl', function($mdSidenav, $stateParams, $state, $http) {
	var self = this;

	self.currentDS;

	self.getDataset = function() {
		$http.get('/twitexp/dataset/'+$stateParams.dsID)
		.then(function(res) {
			console.log('Current Dataset: ');
			console.log(res.data);
			self.currentDS = res.data;
			display(false, res.data);
		});
	}

	self.getDataset();

});