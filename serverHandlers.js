var Clients = require("./clients.js");
var BlackList = require("./black-list.js");
var MuteList = require("./mute-list.js");

function serverHandlers (socket, io) {
	this.io = io;

	socket.on("chat message", function (msg) {
		this.msg = msg;
		msg.type = "message";
		io.emit("chat message", this.msg);
	});

	socket.on("enter user", function(user) {
		if(BlackList.has(user)) {
			socket.emit("login fail");
			Server.sendInform(socket, "Você foi bloqueado pelo administrador.");
			return;
		}

		Clients.add(user, socket);

		Clients.find(user).mute = MuteList[user] == true;

		if(MuteList[user])
			socket.emit("mute", data.mute);

		Server.sendInform(io, user + " ENTROU na sala.");
		Server.sendClientList();

		if(user == "admin")
			socket.emit("admin");

		clog(user + " entrou.");
	});

	socket.on("user logout", function(user) {
		Server.logout(user);
	});

	socket.on("kick", function(user) {
		var targetSocket = Clients.find(user).socket;

		Server.logout(user);

		targetSocket.emit("kick");
		Server.sendInform(targetSocket, "Você foi kickado pelo administrador.");
		Server.sendClientList();
	});

	socket.on("mute", function(user) {
		var target = Clients.find(user);
		target.mute = !target.mute;

		if(target.mute) {
			MuteList.add(target.name);
			Server.sendInform(target.socket, "Você foi SILENCIADO pelo administrador.");
		} else {
			MuteList.remove(target.name);
			Server.sendInform(target.socket, "Você esta LIBERADO para falar.");
		}

		target.socket.emit("mute", target.mute);

		Server.sendClientList();
	});

	Server = {};
	Server.sendInform = function(to, msg) {
		to.emit("chat inform", {
			msg: msg,
			user: "server",
			type: "info"
		});
	}

	Server.sendClientList = function() {
		var list = []
		_userList = Clients.list();

		for(var k in _userList)
			list.push({
				name: _userList[k].name,
				blocked: _userList[k].blocked,
				mute: _userList[k].mute,
			});
		
		io.emit("user list", list);
	}

	Server.sendClientList();

	Server.logout = function(user) {
		Clients.remove(user);

		Server.sendInform(io, user + " SAIU da sala.")
		Server.sendClientList();
	}
}

function clog(msg) {
	if(act_console != true)
		return;

	console.log(msg);
}

exports.serverHandlers = serverHandlers;