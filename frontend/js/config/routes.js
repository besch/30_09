"use strict";

angular.module('Webresume')
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider
      
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html'
        // controller: 'HomeCtrl'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })

      .state('logout', {
        url: '/logout',
        template: '<div></div>',
        controller: 'LogoutCtrl'
      })

      .state('account', {
        url: '/account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        data: {requiresLogin: true}
      })

      .state('chat', {
        url: '/chat',
        templateUrl: 'views/chat.html',
        controller: 'TextChatCtrl',
        data: {requiresLogin: true}
      })

      .state('fileshare', {
        url: '/fileshare',
        templateUrl: 'views/fileshare.html',
        controller: 'FileShareCtrl',
        data: {requiresLogin: true}
      })

      .state('calendar', {
        url: '/calendar',
        templateUrl: 'views/calendar.html',
        controller: 'CalendarCtrl',
        data: {requiresLogin: true}
      })

      .state('video', {
        url: '/video',
        templateUrl: 'views/video.html',
        controller: 'VideoCtrl',
        data: {requiresLogin: true}
      })

      .state('singlevideo', {
        url: '/singlevideo',
        templateUrl: 'views/singlevideo.html',
        controller: 'SingleVideoCtrl',
        data: {requiresLogin: true}
      });

      // .state('video', {
      //   url: '/video/:sessionId',
      //   templateUrl: 'views/video.html'
      // });

      ///////////////////////////////////////////////
      // .state('videoresumehome', {
      //   url: '/videoresume-home',
      //   templateUrl: 'views/home-videoresume.html',
      //   controller: 'VideoCtrl'
      // })

      // .state('videoresumehome.video', {
      //   url: '/videoresume-video',
      //   templateUrl: 'views/video.html'
      // })

      // .state('videoresumehome.screenshare', {
      //   url: '/videoresume-screenshare',
      //   templateUrl: 'views/screenshare.html'
      // })

      // .state('videoresumehome.textchat', {
      //   url: '/videoresume-textchat',
      //   templateUrl: 'views/textchat.html',
      //   controller: 'textChatCtrl'
      // })

      // .state('videoresumehome.history', {
      //   url: '/videoresume-history',
      //   templateUrl: 'views/history.html'
      // });

 }]);