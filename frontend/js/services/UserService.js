'use strict';

angular.module('Webresume')

.factory('UserService', ['$firebase', '$rootScope', 'FBURL', 'auth', function ($firebase, $rootScope, FBURL, auth) {

  if(!auth.isAuthenticated) return;

	var ref = new Firebase(FBURL + '/userStorage'),
      sync = $firebase(ref);

  return {

  	init: function() {
  		if(auth.isAuthenticated) {
  			return $rootScope.auth = auth;
  		}
  		return console.log('Not authorized');
  	},

  	listAllUsers: function() {
  		return sync.$asArray();
  	},

  	userExists: function(email) {
  		var fbData = this.listAllUsers();

  		var temp = fbData.$loaded().then(function() {
  			for(var i = 0; i < fbData.length; i++) {
	  			if(fbData[i].email === email) {
	  				$rootScope.auth.userStorageId = fbData[i].$id;
	  				return true;
	  			}
	  		}
	  		return false;
  		});
  		return temp;
  	},

  	attachUserStorageId: function() {

  	},

  	// getUser: function(email) {
  	// 	var fbData = this.listAllUsers();

  	// 	for(var i = 0; i < fbData.length; i++) {
  	// 		if(fbData[i].user_id === email) {
  	// 			return fbData[i];
  	// 		}
  	// 	}
  	// },

  	createUser: function() {

  		this.init();
  		var user = $rootScope.auth.profile,
  				authService = user.user_id.split('|')[0];

  		var temp = this.userExists(user.email);

  		temp.then(function (data) {
				if(!data) {
					return sync.$push({
						user_id: authService,
				    created_at: user.created_at,
				    email: user.email,
				    given_name: user.given_name,
				    family_name: user.family_name,
				    nickname: user.nickname
				  });
				}
				return console.log('User already exists');
  		});
		}
	};
}]);