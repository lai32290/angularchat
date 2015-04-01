var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var exec = require('child_process').exec;
var path = require("path");
var fs = require("fs");
var serverHandlers = require("./serverHandlers");

act_console = true;
userList = [];
blackList = [];
muteList = [];

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/js", express.static(__dirname + "/js"));
app.get('/', function(request, response){
	response.sendFile(__dirname + '/index.html');
});

io.on("connection", function (socket) {
	console.log("a user connected");

	serverHandlers.serverHandlers(socket, io);
});


http.listen(8123, function () {
	console.log("Server is on.... localhost:8123");
});