function add(user, socket) {
	User = {name: user, socket: socket};
	userList[user] = User;

	return User;
}

function remove(user) {
	delete userList[user];
}

function list() {
	return userList;
}

function find(user) {
	var targetSocket = userList[user];

	return targetSocket;
}

function findBySocketId(id) {
	for(var k in userList) {
		var socket = userList[k].socket;

		if(socket.id == id)
			return userList[k];
	}

	return null;
}

exports.add = add;
exports.remove = remove;
exports.list = list;
exports.find = find;
exports.findBySocketId = findBySocketId;