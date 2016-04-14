(function(){
	'use strict';

	angular
		.module('charterChat')
		.controller('SignupCtrl', SignupCtrl)
		.controller('LoginCtrl', LoginCtrl)
    .controller('PasswordResetCtrl', PasswordResetCtrl)
    .controller('ProfileCtrl', ProfileCtrl)
    .controller('RoomsListCtrl', RoomsListCtrl)
    .controller('RoomDetailCtrl', RoomDetailCtrl)

	//Dependency injecctions
	SignupCtrl.$inject = ['$scope', '$state', 'chatService'];
	LoginCtrl.$inject = ['$scope', '$state', 'chatService'];
  PasswordResetCtrl.$inject = ['$scope', 'chatService'];
  ProfileCtrl.$inject = ['$scope', 'currentAuth', 'chatService', '$state'];
  RoomsListCtrl.$inject = ['$scope', '$ionicPopup', 'chatService'];
  RoomDetailCtrl.$inject = ['$scope', '$stateParams', '$ionicHistory', 'chatService', 'currentAuth'];

	//Signup controller
	function SignupCtrl($scope, $state, chatService){
		$scope.data = {};

		$scope.createUser = function(signupForm){
			if (signupForm.$valid) {
				var newEmail = $scope.data.email;
				var newPassword = $scope.data.password;
				var newFullName = $scope.data.fullName;
				chatService.signupEmail(newEmail, newPassword, newFullName);
			};
		};
	}

	//Login controller
  function LoginCtrl($scope, $state, chatService){
		$scope.data = {};

		$scope.loginEmail = function(loginForm){
			if (loginForm.$valid) {
				var email = $scope.data.email;
				var password = $scope.data.password;
				chatService.loginUser(email, password);
			};
		}
	}

	//Password reset controller
  function PasswordResetCtrl($scope, chatService){
    $scope.data = {};

    $scope.resetPassword = function(passwordResetForm){
      if (passwordResetForm.$valid) {
        var email = $scope.data.email;
        chatService.resetPassword(email);
      };
    };
  }

	//Profile controller (main view)
  function ProfileCtrl($scope, currentAuth, chatService, $state){
    $scope.data = {};
    $scope.userProfile = chatService.userProfileData(currentAuth.uid);

    $scope.logoutUser = function(){
      chatService.logoutUser();
    };

    $scope.changePassword = function(changePasswordForm){
      if (changePasswordForm.$valid) {
        var oldPassword = $scope.data.oldPassword;
        var newPassword = $scope.data.newPassword;
        chatService.changePassword(currentAuth.password.email, oldPassword, newPassword);
      }
    };

    $scope.changeEmail = function(changeEmailForm){
      if (changeEmailForm.$valid) {
        chatService.changeEmail(currentAuth.password.email, $scope.data.newEmail, $scope.data.password);
        $scope.userProfile.email = $scope.data.newEmail;
        $scope.userProfile.$save();
      };
    };
  }

	//Rooms list controller
  function RoomsListCtrl($scope, $ionicPopup, chatService) {
    $scope.rooms = chatService.allRooms();

    $scope.createRoom = function() {
      var timestamp = new Date().valueOf();
      $scope.rooms.$add({
        name: $scope.roomName,
        id: timestamp
      });
    };

    $scope.deleteRoom = function(room) {
      $scope.rooms.$remove(room);
    };
  }

	//Room detail controller
  function RoomDetailCtrl($scope, $stateParams, $ionicHistory, chatService, currentAuth) {
    $scope.room = chatService.getRoom($stateParams.roomId);
    $scope.messages = chatService.getMessages($scope.room.$id);
    $scope.userProfile = chatService.userProfileData(currentAuth.uid);

    $scope.sendMessage = function(newMessage, roomId) {
      $scope.messages.$add({
        username: $scope.userProfile.name,
        content: $scope.newMessage,
        sentAt: Firebase.ServerValue.TIMESTAMP,
        roomId: $scope.room.$id
      });
      $scope.newMessage = '';
    };

    $scope.backToRoomsList = function() {
      $ionicHistory.goBack();
    };
  }
})();
