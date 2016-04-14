(function(){
	'use strict';

	angular
		.module('charterChat')
		.factory('chatService', chatService);

	function chatService($firebaseAuth, $firebaseObject, $firebaseArray, $state, rootRef){
    var rooms = $firebaseArray(rootRef.child('rooms'));
    var messages = $firebaseArray(rootRef.child('messages'));
    var authUser = $firebaseAuth(rootRef);

		return {
			signupEmail: function(newEmail, newPassword, newFullName){
				authUser.$createUser({
					email: newEmail,
					password: newPassword,
					fullName: newFullName,
				}).then(function(authData){
						rootRef.child("userProfile").child(authData.uid).set({
							name: newFullName,
							email: newEmail,
						});
						$state.go('profile');
				}).catch(function(error){
						switch (error.code) {
				      case "EMAIL_TAKEN":
				        alert("Email taken.");
				        break;
				      case "INVALID_EMAIL":
				        alert("Invalid email.");
				        break;
				      default:
				        alert("Error creating user:", error);
				    }
				});
			},
			loginUser: function(email, password){
				authUser.$authWithPassword({
					"email": email,
					"password": password
				}).then (function(authData){
					$state.go('profile');
				}).catch(function(error){
					console.log(error);
				});
			},
			logoutUser: function(){
				authUser.$unauth();
				$state.go('login');
			},
			resetPassword: function(resetEmail){
				authUser.$resetPassword({
					email: resetEmail
				}).then(function(){
					console.log('Password reset email sent.');
				}).catch(function(error){
					console.log(error);
				});
			},
			changePassword: function(email, oldPassword, newPassword){
				authUser.$changePassword({
					email: email,
					oldPassword: oldPassword,
					newPassword: newPassword
				}).then(function(){
					alert('Password changed.');
					$state.go('profile');
				}).catch(function(error){
					console.log(error);
				});
			},
			changeEmail: function(oldEmail, newEmail, password){
				authUser.$changeEmail({
					oldEmail: oldEmail,
					newEmail: newEmail,
					password: password
				}).then(function(){
						alert('Email changed.');
						$state.go('profile');
				}).catch(function(error){
					console.log(error);
				});
			},
			userProfileData: function(userId){
				var userProfileRef = rootRef.child('userProfile').child(userId);
				return $firebaseObject(userProfileRef);
			},
      allRooms: function() {
        return rooms;
			},
      getRoom: function(roomId) {
        return rooms.$getRecord(roomId);
      },
      getMessages: function(roomId) {
        return $firebaseArray(rootRef.child('messages').orderByChild('roomId').equalTo(roomId));
      }
		}
	}
})();