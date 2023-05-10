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
// Initialize the Socket.io server instance with the express server and a option object
// In the option object we can define the maximum allowed http payload size will be 5MB
const io = new Server(server, {
	maxHttpBufferSize: 1.5e7
});
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
	});
	socket.on('updateSettings', (data) => {
		if(authorizedSessions.includes(socket.id))
			updateSettings(data,socket, liveUpdate);
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
					obj.Teams.Away.Logo = JSON.parse(logoA);
					obj.Teams.Home.Logo = JSON.parse(logoH);
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

// Live Updates with FIBS (myBallClub) Private API
function liveUpdate() {
	fs.readFile(__dirname + '/app/json/settings.json', 'utf8', (err, json) => {
		if(err) return console.error(err);
		const obj = JSON.parse(json);
		if(obj.fibsStreaming == false) return console.log('FIBS Streaming is disabled');
		if(obj.fibsStreamingCode == '') return console.log('FIBS Streaming Code is empty');
		const IDfibs = obj.fibsStreamingCode;
		let lastPlay = 1;
		// Open the JSON file containing the last play
		fs.readFile('lastPlay.json', (err, data) => {
			if (err) return fs.writeFile('lastPlay.json', '0', (err) => { if (err) throw err; console.log('lastPlay.json created')}); // If the file doesn't exist create it and set the last play to 0
			lastPlay = JSON.parse(data);
		});
		// Make the request to the FIBS API
		const req_option = { hostname: 's3-eu-west-1.amazonaws.com', port: 443, path: '/game.wbsc.org/gamedata/mbc/' + IDfibs +'t.json', method: 'GET' };
		const req = https.request(req_option, (res) => {
			// If the request is successful update the last play (if it is different from the previous one) and request the new data
			lastPlayCheck(res, lastPlay, IDfibs);
		});
		req.end();
		req.on('error', (e) => { console.log('FIBS update error: ' + e) });
		setTimeout(liveUpdate, 1000);
	});
}

function lastPlayCheck(res, lastPlay, IDfibs) {
	if (res.statusCode == 200) {
		res.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if (data_obj != lastPlay) {
				fs.writeFile('lastPlay.json', JSON.stringify(data_obj), (err) => {
					if (err)
						throw err;
					console.log('lastPlay.json updated');
				});
				requestData(IDfibs, data_obj);
			}
		});
	} else
		console.log('FIBS update error: ' + res.statusCode);
}

function requestData(IDfibs) {
	const req_option = { hostname: 's3-eu-west-1.amazonaws.com', port: 443, path: '/game.wbsc.org/gamedata/mbc/' + IDfibs +'.json', method: 'GET' };
	const req = https.request(req_option, (res) => {
		let data = '';
		if(res.statusCode == 200){
			res.on('data', (data2) => { data += data2; });
			res.on('end', () => {
				updateDataByWBSC(data);
			});
		}else{ console.log('WBSC data update error: ' + res.statusCode); res.on('data', (data) => { data += data; }); res.on('end', () => { console.log(data); }); }
	});
	req.on('error', (e) => { console.log('WBSC data update error: ' + e); });
	req.end();
}

exports.liveUpdate = liveUpdate;

function updateDataByWBSC(data) {
	const data_obj = JSON.parse(data); // JSON object containing the data
	const AwayRuns = data_obj?.awaytotals?.R; const HomeRuns = data_obj?.hometotals?.R; // Runs
	const { awayruns, homeruns } = data_obj; // Runs by inning
	const bases = { 1: data_obj.runner[1] ? true : false, 2: data_obj.runner[2] ? true : false, 3: data_obj.runner[3] ? true : false, }; // Bases
	const inning = parseInt(data_obj.inning); // Inning
	const arrow = data_obj.home == 0 ? 1 : 2; // Arrow (1 = away/TOP, 2 = home/BOT)
	var int = {};
	awayruns.forEach((run, i) => { if(i!==0&&run!=undefined) int[i] = { A: run, H: homeruns[i] != undefined ? homeruns[i] : 0 }; });
	getAndUpdateJSON();
	function getAndUpdateJSON() {
		fs.readFile(__dirname + '/app/json/data.json', (err, data) => {
			if (err)
				return console.error(err);
			const oldData = JSON.parse(data);
			const objToSend = { Teams: { Away: { Name: oldData.Teams.Away.Name, Score: AwayRuns !== undefined ? AwayRuns : oldData.Teams.Away.Score, Color: oldData.Teams.Away.Color, Short: oldData.Teams.Away.Short, }, Home: { Name: oldData.Teams.Home.Name, Score: HomeRuns !== undefined ? HomeRuns : oldData.Teams.Home.Score, Color: oldData.Teams.Home.Color, Short: oldData.Teams.Home.Short, } }, Ball: data_obj.balls !== undefined ? data_obj.balls : oldData.Ball, Strike: data_obj.strikes !== undefined ? data_obj.strikes : oldData.Strike, Out: data_obj.outs !== undefined ? data_obj.outs : oldData.Out, Bases: bases, Inning: inning ? inning : oldData.Inning, Arrow: arrow ? arrow : oldData.Arrow, Bases: bases, Int: Object.keys(int).length ? int : oldData.Int };
			fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(objToSend, null, 4), (err) => {
				if (err)
					return console.error("Error writing to data.json" + err);
				io.emit('update', objToSend);
			});
		});
	}
}
