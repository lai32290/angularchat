function add(user) {
	blackList[user] = true;
}

function remove(user) {
	delete blackList[user];
}

function has(user) {
	return blackList[user] == true;
}

function list() {
	return blackList;
}

exports.add = add;
exports.remove = remove;
exports.has = has;
exports.list = list;