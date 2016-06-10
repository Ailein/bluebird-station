angular.module('bbsApp')
.controller('mainCtrl', function($mdSidenav, $stateParams, $state, $http) {
	var self = this;

	self.user;
	self.email;
	self.password;

	self.allDS;

	self.errMsg;

	self.getCurrentUser = function() {
		$http.get('/currentUser')
		.then(function(res) {
			console.log('Current User: ');
			console.log(res.data);
			self.user = res.data;
		});
	}

	self.getCurrentUser();

	self.getAllDatasets = function() {
		$http.get('/twitexp/datasets')
		.then(function(res) {
			console.log('All Datasets: ');
			console.log(res.data);
			self.allDS = res.data;
		});
	}

	self.getAllDatasets();

	self.submitLogin = function() {
		$http.post('/login', {email: self.email, password: self.password})
		.then(function(res) {
			if(res.data) {
				self.user = res.data;
				self.errMsg = undefined;
				$state.go('home');
			}else {
				self.errMsg = 'Incorrect Email or Password';
			}
		});
	}

	self.submitLogout = function() {
		$http.get('/logout')
		.then(function(res) {
			console.log(res.data.msg);
			self.user = null;
			$state.go('home');
		});
	}

	self.openLeftMenu = function() {
		$mdSidenav('left').toggle();
	};
});