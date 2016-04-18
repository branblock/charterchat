(function(){
  'use strict';

  angular
    .module('CharterChat', ['ionic', 'firebase', 'ngMessages', 'angularMoment'])
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

        .state('home', {
          url: '/home',
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl',
          resolve: {
            'currentAuth': ['Auth', function(Auth){
              return Auth.$requireAuth();
            }]
          },
        })

        .state('changeEmail', {
          url: '/changeEmail',
          templateUrl: 'templates/changeEmail.html',
          controller: 'HomeCtrl',
          resolve: {
            'currentAuth': ['Auth', function(Auth){
              return Auth.$requireAuth();
            }]
          },
        })

        .state('changePassword', {
          url: '/changePassword',
          templateUrl: 'templates/changePassword.html',
          controller: 'HomeCtrl',
          resolve: {
            'currentAuth': ['Auth', function(Auth){
              return Auth.$requireAuth();
            }]
          },
        })

        .state('users', {
          url: '/users',
          templateUrl: 'templates/usersList.html',
          controller: 'HomeCtrl',
          resolve: {
            'currentAuth': ['Auth', function(Auth){
              return Auth.$requireAuth();
            }]
          },
        })

        .state('currentUser', {
          url: '/users/:userId',
          templateUrl: 'templates/currentUserDetail.html',
          controller: 'HomeCtrl',
          resolve: {
            'currentAuth': ['Auth', function(Auth){
              return Auth.$requireAuth();
            }]
          }
        })

        .state('user', {
          url: '/users/:userId',
          templateUrl: 'templates/userDetail.html',
          controller: 'HomeCtrl',
          resolve: {
            'currentAuth': ['Auth', function(Auth){
              return Auth.$requireAuth();
            }]
          }
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
      //Add function to avoid error: "[$rootScope:infdig] 'x' $digest() iterations reached. Aborting!"
      $urlRouterProvider.otherwise(function($injector, $location){
        var $state = $injector.get('$state');
        $state.go('home');
      });
    }])

    .constant('FBURL', 'https://blockchat.firebaseio.com/')
})();
