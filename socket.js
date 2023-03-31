const env = require('./.env.json')
const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require("socket.io");
const fs = require('fs');
const AppElectron = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const {updateActive,updateOfficial,updateSettings,resetAllStaff,updateData} = require('./updateData');
// Definition of server and socket.io
const app = express();
process.env = env
const server = http.createServer(app);
const io = new Server(server);
//definitions of constaints
const PORT = process.argv[2]|| process.env.PORT || 2095;
const API = process.env.API || 'api.facchini-pu.it';
const CLIENT = process.env.CLIENT || 'DEMO';


// definitions of request options
const reqOption = {
	"checkstat": {
		hostname: API,
		port: 443,
		path: '/checkstat',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		}
	}
};
exports.app = app;
exports.PORT = PORT;
exports.API = API;
exports.CLIENT = CLIENT;
exports.server = server;
exports.BrowserWindow = BrowserWindow;
exports.AppElectron = AppElectron;
exports.reqOption = reqOption;

app.use(express.static(__dirname + '/app'));
app.use(express.json({
	verify: (req, res, buf) => {
		req.rawBody = buf
	}
}));
let authorizedSessions = [];
io.on('connection', (socket) => {
	console.log('a user connected\tID: '+socket.id);
	const ver_data = JSON.stringify({
		id: socket.handshake.auth.id,
		token: socket.handshake.auth.token
	});
	socket.on('update_data', (data) => {
		if(authorizedSessions.includes(socket.id))
			updateData(data,socket);
		else{
			console.log('Unauthorized update data', socket.id, authorizedSessions);
		}
	});
	socket.on('updateSettings', (data) => {
		if(authorizedSessions.includes(socket.id))
			updateSettings(data,socket);
	});
	socket.on('updateActive',(data)=>{
		if(authorizedSessions.includes(socket.id))
			updateActive(data,socket);
	});
	socket.on('updateOffices',(data)=>{
		if(authorizedSessions.includes(socket.id))
			updateOfficial(data,socket);
	});
	socket.on('Reset_all_staff',()=>{
		if(authorizedSessions.includes(socket.id))
			resetAllStaff(socket);
	});
	socket.on('getSettings',()=>{
		fs.readFile(__dirname + '/app/json/settings.json', 'utf8', (err, data) => {
			let resp = JSON.parse(data);
			fs.readFile(__dirname + '/app/json/data.json', 'utf8', (err, data2) => {
				const obj2 = JSON.parse(data2);
				resp.Data = obj2;
				socket.emit('connectSettings',resp);
			})
		})
	});
	socket.on('getData',()=>{
		fs.readFile(__dirname + '/app/json/data.json', 'utf8', (err, json) => {
			if(err)
				return console.error(err);
			fs.readFile(__dirname + '/app/img/AwayLogo.json' , 'utf8', (err, logoA) => {
				if(err)
					return console.error(err);
				fs.readFile(__dirname + '/app/img/HomeLogo.json' , 'utf8', (err, logoH) => {
					if(err)
						return console.error(err);
					let obj = JSON.parse(json);
					obj.Teams.Away.Logo = logoA;
					obj.Teams.Home.Logo = logoH;
					socket.emit('connectData',obj);
				});
			});
		})
	});
	socket.on('getActive',()=>{
		fs.readFile(__dirname + '/app/json/scoreboards.json', 'utf8', (err, data) => {
			socket.emit('connectActive',data);
		})
	});
	socket.on('getOffices',()=>{
		fs.readFile(__dirname + '/app/json/umpiresScorers.json', 'utf8', (err, data) => {
			if(err){
				console.error(err);
				return;
			}
			socket.emit('connectOffices',JSON.parse(data));
		})
	});
	socket.on('disconnect', () => {
		console.log('user disconnected\tID: '+socket.id);
		authorizedSessions = authorizedSessions.filter((item) => item !== socket.id);
	});
	if(socket.handshake.auth.id && socket.handshake.auth.token){
		if(socket.handshake.auth.id == 'guest' && socket.handshake.auth.token == 'guest' && CLIENT == 'DEMO'){
			socket.emit('auth', { ok: true, message: 'authorized' });
			authorizedSessions.push(socket.id);
			console.log('Authorized session', socket.id, authorizedSessions);
		}else{
			https.request(reqOption.checkstat, (ver_res) => {
				ver_res.on('data', (d) => {
					//process.stdout.write(d);
					res_data = JSON.parse(d);
					if (res_data.ok === true) {
						socket.emit('auth', { ok: true, message: 'authorized' });
						authorizedSessions.push(socket.id);
						console.log('Authorized session', socket.id, authorizedSessions);
					} else {
						socket.emit('auth', { ok: false, message: 'not authorized' });
					}
				});
			}).on('error', (e) => {
				console.error(e);
			}).end(ver_data);
		}
	}else{
		socket.emit('auth', { ok: false, message: 'not authorized' });
		console.log('Unauthorized session', socket.id, authorizedSessions);
	}
});
