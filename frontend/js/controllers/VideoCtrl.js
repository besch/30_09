'use strict';

// if (!window.TB) throw new Error('You must include the TB library before the TB_Angular library');

angular.module('Webresume')

.controller('VideoCtrl', ['$scope', '$http', 'TB', '$log', '$rootScope',
  function($scope, $http, TB, $log, $rootScope) {

    $scope.user = $rootScope.auth.profile.given_name + ' ' + $rootScope.auth.profile.family_name;
    $scope.archiveName = '';

    $http.get('/video/history').then(function(res) {
      $scope.archives = res.data.archives;
    });


    var idOfArchive = null;

    $scope.startSession = function() {
      $http.get('/video/index').then(function(res) {
        var apiKey = res.data.apiKey,
            sessionId = res.data.sessionId,
            token = res.data.token;
        $scope.sessionId = sessionId;

        var session = TB.initSession(apiKey, sessionId),
            publisher = TB.initPublisher('publisher');

        session.connect(token, function(err, info) {
          if(err) {
            $log.error(err.message || err);
          }
          session.publish(publisher);
        });

        session.on('archiveStarted', function(event) {
          // archiveId = event;
          $log.info('Recording started', event);
          $scope.isDisabled = true;
        });

        session.on('archiveStopped', function(event) {
          // archiveId = null;
          $log.info('Recording stopped');
          $scope.isDisabled = false;
        });

        session.on('streamCreated', function(event) {
          session.subscribe(event.stream, 'subscribers', {insertMode: 'append'});
        });

      });
      $scope.isCameraOn = true;
    };


    $scope.invitePerson = function() {
      if($scope.invitePersonEmail !== '') {
        $http.get('/video/invite', {params: {email: $scope.invitePersonEmail , sessionId: $scope.sessionId}});
        $scope.isInviteOn = false;
        $scope.invitePersonEmail = '';
      }
    };

    $scope.startRecording = function() {
      $http.get('/video/start', { params: { name: $scope.archiveName }}).then(function(res) {
        idOfArchive = res.data.id;
        $scope.isDisabled = true;
      });
    };

    $scope.stopRecording = function() {
      $http.get('/video/stop/' + idOfArchive).then(function() {
        console.log('recording stopped');
        console.log(idOfArchive);
        idOfArchive = null;
      });

      $scope.archiveName = '';
      $scope.isDisabled = false;
      setTimeout(function() {
        $scope.$apply(function() { // wait for opentok to apply changes
          $http.get('/video/history').then(function(res) {
            $scope.archives = res.data.archives;
          });
        });
      }, 5000);
    };

    $scope.deleteArchive = function(id) {
      $http.get('/video/delete/' + id);
      idOfArchive = null;
      setTimeout(function() { // wait for opentok to apply changes
        $scope.$apply(function() {
          $http.get('/video/history').then(function(res) {
            $scope.archives = res.data.archives;
          });
        });
      }, 1000);
    };

    $scope.$watch('archives', function(newData) {
      $scope.archives = newData;
    });

    $scope.clearEmailField = function() {
      $scope.invitePersonEmail = '';
    };
  }
])

.factory('TB', ['$window', function($window) {
  return $window.TB;
}])

.filter('splitUrl', ['$sce', function($sce) {
  return function(input) {
    if(input !== null && input !== 'undefined') {
      return $sce.trustAsResourceUrl(input.split('?')[0]);
    }
    else {
      return;
    }
  };
}]);