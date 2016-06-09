angular.module('bbsApp')
.controller('mainCtrl', function($mdSidenav, $stateParams, $state, $http) {
	var self = this;

	self.user;
	self.email;
	self.password;

	self.errMsg;

	self.getCurrentUser = function() {
		$http.get('/currentUser')
		.then(function(res) {
			console.log('Current User' + res.data);
			self.user = res.data;
		});
	}

	self.submitLogin = function() {
		console.log('Email: ' + self.email);
		console.log('Password: ' + self.password);
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
});