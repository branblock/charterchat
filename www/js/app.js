(function(){
  'use strict';

  angular
    .module('charterChat', ['ionic', 'firebase', 'ngMessages'])
    .service('rootRef', ['FBURL', Firebase])
    .factory('Auth', ['$firebaseAuth', 'rootRef',
		  function($firebaseAuth, rootRef) {
		    return $firebaseAuth(rootRef);
		  }
    ])

  .run(['$ionicPlatform', '$rootScope', '$state', function($ionicPlatform, $rootScope, $state){
    $ionicPlatform.ready(function(){
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
    // stateError for un-authenticated users
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
      if (error === "AUTH_REQUIRED") {
        $state.go('login');
      };
    });
  }])

  .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
      })

      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl',
      })

      .state('passwordResetForm', {
        url: '/passwordResetForm',
        templateUrl: 'templates/passwordResetForm.html',
        controller: 'PasswordResetCtrl',
      })

      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          'currentAuth': ['Auth', function(Auth){
            return Auth.$requireAuth();
          }]
        },
      })

      .state('changeEmail', {
        url: '/changeEmail',
        templateUrl: 'templates/changeEmail.html',
        controller: 'ProfileCtrl',
        resolve: {
          'currentAuth': ['Auth', function(Auth){
            return Auth.$requireAuth();
          }]
        },
      })

      .state('changePassword', {
        url: '/changePassword',
        templateUrl: 'templates/changePassword.html',
        controller: 'ProfileCtrl',
        resolve: {
          'currentAuth': ['Auth', function(Auth){
            return Auth.$requireAuth();
          }]
        },
      })

      .state('rooms', {
        url: '/rooms',
        templateUrl: 'templates/roomsList.html',
        controller: 'RoomsListCtrl',
        resolve: {
          'currentAuth': ['Auth', function(Auth){
            return Auth.$requireAuth();
          }]
        },
      })

      .state('room', {
        url: '/rooms/:roomId',
        templateUrl: 'templates/roomDetail.html',
        controller: 'RoomDetailCtrl',
        resolve: {
          'currentAuth': ['Auth', function(Auth){
            return Auth.$requireAuth();
          }]
        },
      });
    $urlRouterProvider.otherwise('profile');
  }])

  .constant('FBURL', 'https://blockchat.firebaseio.com/')
})();
