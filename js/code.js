var socket = io();
var app = angular.module("helloChat", []);
var chatCtrlScope;

app.controller("chatCtrl", ["$scope", function ($scope) {
	chatCtrlScope = $scope;

	$scope.user;
	$scope.message;
	$scope.messages = [];
	$scope.users = [];
	$scope.isAdmin = false;
	$scope.blocked = false;
	$scope.mute = false;

	$scope.login = function () {
		$scope.user = $scope._user;

		socket.sendBuffer = [];
		socket.receiveBuffer = [];
		socket.emit("enter user", $scope.user);
	}

	$scope.sendmsg = function () {
		socket.emit("chat message", {msg: $scope.message, user: $scope.user});

		$scope.message = "";
		return false;
	}

	$scope.sair = function() {
		if(!$scope.user)
			return;

		$scope.isAdmin = false;
		socket.emit("user logout", $scope.user);
		$scope.user = null;
	}

	$scope.limpar = function() {
		$scope.messages = [];
	}

	$scope.kick = function(user) {
		socket.emit("kick", user.name);
	}

	$scope.muteing = function(user) {
		socket.emit("mute", user.name);
	}

	// ---------------------------------------------- Private functions
	$scope.newMessage = function(msg) {
		$scope.messages.push({
			msg: msg.msg,
			user: msg.user, 
			type: msg.type
		});

		$scope.$digest();
	}

	$scope.updateUserList = function(list) {
		$scope.users = list;
		$scope.$digest();
	}

	$scope.kicked = function() {
		$scope.user = null;
		$scope.message = null;
		$scope.$digest();
	}

	$scope.muting = function(bln) {
		$scope.mute = bln;
		$scope.$digest();
	}

	$scope.loginFail = function() {
		$scope.user = null;
		$scope.$digest();
	}
}]);


socket.on("chat inform", function (msg) {
	chatCtrlScope.newMessage(msg);
});

socket.on("chat message", function(msg) {
	chatCtrlScope.newMessage(msg);
});

socket.on("user list", function(list) {
	chatCtrlScope.updateUserList(list);
});

socket.on("kick", function() {
	chatCtrlScope.kicked();
});

socket.on("admin", function() {
	chatCtrlScope.isAdmin = true;
	chatCtrlScope.$digest();
});

socket.on("mute", function(bln) {
	chatCtrlScope.muting(bln);
});

socket.on("login fail", function() {
	chatCtrlScope.loginFail();
});

$(window).bind("beforeunload", function() { 
	chatCtrlScope.sair();
});
