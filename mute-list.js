function add(user) {
	muteList[user] = true;
}

function remove(user) {
	delete muteList[user];
}

function has(user) {
	return muteList[user] == true;
}

function list() {
	return muteList;
}

exports.add = add;
exports.remove = remove;
exports.has = has;
exports.list = list;