'use strict';

angular.module('Webresume')

.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$timeout', 'auth', 'UserService', 
  function($scope, $rootScope, $state, $timeout, auth, UserService) {

		auth.signin({
			popup: true
		}, function() {
			UserService.createUser();
			$state.go('home');
		}, function() {
			console.log('Failed to authenticate');
		});

  }
]);