angular.module('bbsApp', ['ngMaterial', 'ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/404');

	var home = {
		name: 'home',
		url: '/',
		templateUrl: 'partials/home.html',
		onEnter: function() {
			console.log('home');
		}
	};
	var fourzerofour = {
		name: '404',
		url: '/404',
		templateUrl: 'partials/404.html',
		onEnter: function() {
			console.log('404');
		}
	};
	var login = {
		name: 'login',
		url: '/login',
		templateUrl: 'partials/login.html',
		onEnter: function() {
			console.log('login');
		}
	};
	var dataset = {
		name: 'dataset',
		url: '/dataset/:dsID',
		templateUrl: 'partials/dataset.html',
		controller: 'datasetCtrl',
		controllerAs: 'dsctrl',
		onEnter: function() {
			console.log('dataset');
		}
	};

	$stateProvider.state(home);
	$stateProvider.state(fourzerofour);
	$stateProvider.state(login);
	$stateProvider.state(dataset);
});