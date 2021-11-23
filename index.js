require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

const PORT = process.argv[2]|| process.env.PORT || 2095;
console.log("PORT:", PORT);

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "https://api.facchini-pu.it");
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(express.static(__dirname + '/app'));
app.use(express.json({
	verify: (req, res, buf) => {
		req.rawBody = buf
	}
}));

io.on('connection', (socket) => {
	console.log('a user connected');
	//console.log(socket.handshake.auth);
	socket.on('update_data', (data) => {			
		console.log("update data recived:"+JSON.stringify(data));
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			const ver_options = {
				hostname: 'api.facchini-pu.it',
				port: 443,
				path: '/checkstat',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			}
			const ver_data = JSON.stringify({
				id: socket.handshake.auth.id,
				token: socket.handshake.auth.token
			});
			const ver_req = https.request(ver_options, (ver_res) => {
				//console.log(`statusCode: ${ver_res.statusCode}`)
				ver_res.on('data', (d) => {
					//process.stdout.write(d);
					res_data = JSON.parse(d);
					if (res_data.ok === true) {
						console.log('Update_data Autenticated');
					}
				});
			});
			ver_req.on('error', (e) => {
				console.error(e);
			});
			ver_req.write(ver_data);
			ver_req.end();
		}
	});
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	fs.readFile('./app/json/data.json', function(err, data) {
		if (err) throw err;
		const json = JSON.parse(data);
		io.emit('update',json)
	});
});
server.listen(PORT, () => {
	console.log('listening on http://localhost:' + PORT);
});
