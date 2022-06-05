const env = require('./.env.json')
process.env = env
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const { shell } = require('electron');
const AppElectron = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const crypto = require('crypto');
//definitions of constaints
const PORT = process.argv[2]|| process.env.PORT || 2095;
const API = process.env.API || 'api.facchini-pu.it';
const CLIENT = process.env.CLIENT || 'DEMO';

app.use(express.static(__dirname + '/app'));
app.use(express.json({
	verify: (req, res, buf) => {
		req.rawBody = buf
	}
}));

io.on('connection', (socket) => {
	console.log('a user connected\tID: '+socket.id);
	socket.on('update_data', (data) => {			
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			const ver_options = {
				hostname: API,
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
				ver_res.on('data', (d) => {
					//process.stdout.write(d);
					res_data = JSON.parse(d);
					if (res_data.ok === true) {
						fs.readFile(__dirname + '/app/json/data.json', 'utf8', (err, data_old) => {
							if (err) throw err;
							var json = JSON.parse(data);
							var data_old_obj = JSON.parse(data_old);
							Object.entries(json).forEach(entry => {
								const [indx, element] = entry;
								if(element === '+'){
									var { ScoreATmp, ScoreHTmp, i } = plusChanges();
								}else if(element === '-'){
									var { ScoreATmp, ScoreHTmp, i } = minusChanges();
								}else if(element === '0'){
									var i = zeroChanges();
								}else if(element === 'toggle'){
									toggleChanges();
								}else if(indx === 'Teams.Away.Name')
									data_old_obj.Teams.Away.Name = element;
								else if(indx === 'Teams.Home.Name')
									data_old_obj.Teams.Home.Name = element;
								else if(indx === 'Teams.Away.Color')
									data_old_obj.Teams.Away.Color = element;
								else if(indx === 'Teams.Home.Color')
									data_old_obj.Teams.Home.Color = element;
								else
									data_old_obj[indx] = element;

								function toggleChanges() {
									if (indx === '1')
										data_old_obj.Bases[1] = !data_old_obj.Bases[1];
									else if (indx === '2')
										data_old_obj.Bases[2] = !data_old_obj.Bases[2];
									else if (indx === '3')
										data_old_obj.Bases[3] = !data_old_obj.Bases[3];
									else if (indx === 'Auto_Change_Inning') {
										data_old_obj.Bases[1] = false;
										data_old_obj.Bases[2] = false;
										data_old_obj.Bases[3] = false;
										data_old_obj.Ball = 0;
										data_old_obj.Strike = 0;
										data_old_obj.Out = 0;
										if (data_old_obj.Arrow == 1) {
											data_old_obj.Arrow = 2;
										} else {
											data_old_obj.Arrow = 1;
											data_old_obj.Inning++;
											data_old_obj.Int[data_old_obj.Inning] = { A: 0, H: 0 };
										}
									} else if (indx === 'Reset_All')
										data_old_obj = { "Teams": { "Away": { "Name": "AWAY", "Score": 0, "Color": "#000000" }, "Home": { "Name": "HOME", "Score": 0, "Color": "#000000" } }, "Ball": 0, "Strike": 0, "Out": 0, "Inning": 1, "Arrow": 1, "Bases": { "1": false, "2": false, "3": false }, "Int": { "1": { "A": 0, "H": 0 } } };
								}
								function zeroChanges() {
									if (indx === 'Inning') {
										data_old_obj[indx] = 1;
										data_old_obj.Int = { 1: { A: 0, H: 0 } };
										data_old_obj.Teams.Away.Score = 0;
										data_old_obj.Teams.Home.Score = 0;
									} else if (indx === 'Teams.Away.Score') {
										data_old_obj.Teams.Away.Score = 0;
										for (var i = 1; i <= data_old_obj.Inning; i++)
											data_old_obj.Int[i].A = 0;
									} else if (indx === 'Teams.Home.Score') {
										data_old_obj.Teams.Home.Score = 0;
										for (var i = 1; i <= data_old_obj.Inning; i++)
											data_old_obj.Int[i].H = 0;
									}
									else
										data_old_obj[indx] = 0;
									return i;
								}
								function minusChanges() {
									if (indx === 'Teams.Home.Score' && data_old_obj.Int[data_old_obj.Inning].H > 0) {
										data_old_obj.Int[data_old_obj.Inning].H--;
										data_old_obj.Teams.Home.Score--;
									} else if (indx === 'Teams.Away.Score' && data_old_obj.Int[data_old_obj.Inning].A > 0) {
										data_old_obj.Int[data_old_obj.Inning].A--;
										data_old_obj.Teams.Away.Score--;
									} else if (indx === 'Inning') {
										if (data_old_obj.Inning > 1) {
											delete data_old_obj.Int[data_old_obj.Inning];
											data_old_obj.Inning--;
											var ScoreATmp = 0, ScoreHTmp = 0;
											for (var i = 1; i <= data_old_obj.Inning; i++) {
												ScoreATmp += data_old_obj.Int[i].A;
												ScoreHTmp += data_old_obj.Int[i].H;
											}
											data_old_obj.Teams.Away.Score = ScoreATmp;
											data_old_obj.Teams.Home.Score = ScoreHTmp;
										}
									} else if (data_old_obj[indx] > 0)
										data_old_obj[indx]--;
									return { ScoreATmp, ScoreHTmp, i };
								}
								function plusChanges() {
									if (indx === 'Ball' && data_old_obj.Ball < 3)
										data_old_obj[indx] = data_old_obj[indx] + 1;
									else if (indx === 'Strike' && data_old_obj.Strike < 2)
										data_old_obj[indx]++;
									else if (indx === 'Out' && data_old_obj.Out < 2)
										data_old_obj[indx]++;
									else if (indx === 'Teams.Away.Score') {
										data_old_obj.Int[data_old_obj.Inning].A++;
										var ScoreATmp = 0;
										for (var i = 1; i <= data_old_obj.Inning; i++) {
											ScoreATmp += data_old_obj.Int[i].A;
										}
										data_old_obj.Teams.Away.Score = ScoreATmp;
									} else if (indx === 'Teams.Home.Score') {
										data_old_obj.Int[data_old_obj.Inning].H++;
										var ScoreHTmp = 0;
										for (var i = 1; i <= data_old_obj.Inning; i++) {
											ScoreHTmp += data_old_obj.Int[i].H;
										}
										data_old_obj.Teams.Home.Score = ScoreHTmp;
									} else if (indx === 'Inning') {
										data_old_obj.Inning++;
										data_old_obj.Int[data_old_obj.Inning] = { A: 0, H: 0 };
									}
									return { ScoreATmp, ScoreHTmp, i };
								}
							});
							fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(data_old_obj, null, 4), (err) => {
								if (err) throw err;
							});
							socket.emit('update', data_old_obj);
							socket.broadcast.emit('update', data_old_obj);
						});
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

	socket.on('updateSettings', (data) => {			
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			const ver_req_set_option = {
				hostname: API,
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
			const ver_req_set = https.request(ver_req_set_option, (ver_res) => {
				ver_res.on('data', (d) => {
					//process.stdout.write(d);
					res_data = JSON.parse(d);
					if (res_data.ok === true) {
						fs.readFile(__dirname + '/app/json/settings.json', 'utf8', (err, data_old) => {
							if (err) throw err;
							var json = JSON.parse(data);
							var data_old_obj = JSON.parse(data_old);
							Object.entries(json).forEach(entry => {
								const [indx, element] = entry;
								switch(element) { 
										default:
											data_old_obj[indx]=element;
											break;
									}
							});
							fs.writeFile(__dirname + '/app/json/settings.json', JSON.stringify(data_old_obj, null, 4), (err) => {
								if (err) throw err;
							});
							socket.emit('updateSettings', data_old_obj);
							socket.broadcast.emit('updateSettings', data_old_obj);
						});
					}
				});
			});
			ver_req_set.on('error', (e) => {
				console.error(e);
			});
			ver_req_set.write(ver_data);
			ver_req_set.end();
		}
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
			const obj = JSON.parse(json);
			socket.emit('connectData',obj);
		})
	});
	socket.on('updateActive',(data)=>{
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			const ver_req_set_option = {
				hostname: API,
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
			const ver_req_set = https.request(ver_req_set_option, (ver_res) => {
				ver_res.on('data', (d) => {
					res_data = JSON.parse(d);
					if (res_data.ok === true) {
						// Update The Active Scoreboards List
						fs.readFile(__dirname + '/app/json/scoreboards.json', 'utf8', (err, scoreboard_old) => {
							if (err) {
								console.error(err);
								return;
							}
							var json = JSON.parse(data);
							var jsonOld = JSON.parse(scoreboard_old);
							var changes = {};
							// Compare The Old Scoreboard With The New Scoreboard and save the changes
							Object.entries(json).forEach(entry => {
								const [indx, element] = entry;
								if(element == true){
									jsonOld[indx] = true;
									changes[indx] = true;
								}else{
									jsonOld[indx] = false;
									changes[indx] = false;
								}
							});
							fs.writeFile(__dirname + '/app/json/scoreboards.json', JSON.stringify(jsonOld, null, 4), (err) => {
								if (err) throw err;
								const changesJson = JSON.stringify(changes);
								socket.emit('updateActive',changesJson);
								socket.broadcast.emit('updateActive',changesJson);
							});
						})
					}
				});
			});
			ver_req_set.on('error', (e) => {
				console.error(e);
			});
			ver_req_set.write(ver_data);
			ver_req_set.end();
		}
	});
	socket.on('getActive',()=>{
		fs.readFile(__dirname + '/app/json/scoreboards.json', 'utf8', (err, data) => {
			socket.emit('connectActive',data);
		})
	});
	socket.on('disconnect', () => {
		console.log('user disconnected\tID: '+socket.id);
	});
});

app.post('/login', (req, res) => {
	const { username, password, remember} = req.body;
	if(!username || !password){
		res.status(400).json({ok:false,message:'missing data'});
		return;
	}
	if(username == 'guest' && password == 'guest'){
		res.status(200).json({ok:true,message:'login success',id:"guest",token:'guest'});
		return;
	}
	//Convert password from base64 to utf8
	const password2 = Buffer.from(password, 'base64').toString('utf8');
	//convert password to hash
	const hash = crypto.createHash('sha256').update(password2).digest('hex');
	const req_option = {
		hostname: API,
		port: 443,
		path: '/login',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const req_data = JSON.stringify({
		email: username,
		password: hash,
		remember: remember,
		scoreboard: CLIENT
	});
	//make a request to remote APIs
	const req_post = https.request(req_option, (res_post) => {
		res_post.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if(data_obj.ok === true){
				res.status(200).send(data_obj);
			}else{
				res.status(res_post.statusCode).send(data_obj);
			}
		});
	});
	req_post.on('error', (e) => {
		console.error(e);
	});
	req_post.write(req_data);
	req_post.end();
});

app.post('/checkstat', (req, res) => {
	const { id, token } = req.body;
	if(!id){
		res.status(400).json({ok:false,message:'missing ID'});
		return;
	}
	if(!token){
		res.status(400).json({ok:false,message:'missing ID'});
		return;
	}
	if(id == 'guest' && token == 'guest'){
		res.status(200).json({ok:true,message:'guest',user: {email:'guest',name: 'guest',surname:"",isOwner:true}});
		return;
	}
	const req_option = {
		hostname: API,
		port: 443,
		path: '/checkstat',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const req_data = JSON.stringify({
		id: id,
		token: token
	});
	//make a request to remote APIs
	const req_post = https.request(req_option, (res_post) => {
		res_post.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if(data_obj.ok === true){
				res.status(200).send(data_obj);
			}else{
				res.status(res_post.statusCode).send(data_obj);
			}
		});
	});
	req_post.on('error', (e) => {
		console.error(e);
	});
	req_post.write(req_data);
	req_post.end();
});
app.post('/logout', (req, res) => {
	const { id, token } = req.body;
	if(!id || !token){
		res.status(400).json({ok:false,message:'missing data'});
		return;
	}
	if(id == 'guest' && token == 'guest'){
		res.status(200).json({ok:true,message:'guest'});
		return;
	}
	const req_option = {
		hostname: API,
		port: 443,
		path: '/logout',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const req_data = JSON.stringify({
		id: id,
		token: token
	});
	//make a request to remote APIs
	const req_post = https.request(req_option, (res_post) => {
		res_post.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if(data_obj.ok === true){
				res.status(200).send(data_obj);
			}else{
				res.status(res_post.statusCode).send(data_obj);
			}
		});
	}
	);
	req_post.on('error', (e) => {
		console.error(e);
	}
	);
	req_post.write(req_data);
	req_post.end();
});
app.post("/getAuthUsers", (req, res) => {
	const { id, token } = req.body;
	if(!id || !token){
		res.status(400).json({ok:false,message:'missing data'});
		return;
	}
	if(id == 'guest' && token == 'guest'){
		res.status(200).json({ok:true,message:'guest', users:[{id:'0',name: "guest", surname: "", email: ""}]});
		return;
	}	
	const req_option = {
		hostname: API,
		port: 443,
		path: '/getAuthUsers',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const req_data = JSON.stringify({
		id: id,
		token: token,
		scoreboard: CLIENT
	});
	//make a request to remote APIs
	const req_post = https.request(req_option, (res_post) => {
		res_post.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if(data_obj.ok === true){
				res.status(200).send(data_obj);
			}else{
				res.status(res_post.statusCode).send(data_obj);
			}
		});
	});
	req_post.on('error', (e) => {
		console.error(e);
	}
	);
	req_post.write(req_data);
	req_post.end();
});

app.post("/addAuthUser", (req, res) => {
	const { id, token, email } = req.body;
	if(!id){
		res.status(400).json({ok:false,message:'missing ID'});
		return;
	}
	if(!token){
		res.status(400).json({ok:false,message:'missing token'});
		return;
	}
	if(!email){
		res.status(400).json({ok:false,message:'missing email'});
		return;
	}
	if(id == 'guest' && token == 'guest'){
		res.status(400).json({ok:false,message:'guest'});
		return;
	}
	const req_option = {
		hostname: API,
		port: 443,
		path: '/addAuthUser',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const req_data = JSON.stringify({
		id: id,
		token: token,
		email: email,
		scoreboard: CLIENT
	});
	//make a request to remote APIs
	const req_post = https.request(req_option, (res_post) => {
		res_post.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if(data_obj.ok === true){
				res.status(200).send(data_obj);
			}else{
				res.status(res_post.statusCode).send(data_obj);
			}
		});
	});
	req_post.on('error', (e) => {
		console.error(e);
	});
	req_post.write(req_data);
	req_post.end();
});

app.post("/removeAuthUser", (req, res) => {
	const { id, token, user_id } = req.body;
	if(!id){
		res.status(400).json({ok:false,message:'missing ID'});
		return;
	}
	if(!token){
		res.status(400).json({ok:false,message:'missing token'});
		return;
	}
	if(!user_id){
		res.status(400).json({ok:false,message:'missing user_id'});
		return;
	}
	if(id == 'guest' && token == 'guest'){
		res.status(400).json({ok:false,message:'guest'});
		return;
	}
	const req_option = {
		hostname: API,
		port: 443,
		path: '/removeAuthUser',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	const req_data = JSON.stringify({
		id: id,
		token: token,
		user_id: user_id,
		scoreboard: CLIENT
	});
	//make a request to remote APIs
	const req_post = https.request(req_option, (res_post) => {
		res_post.on('data', (data) => {
			const data_obj = JSON.parse(data);
			if(data_obj.ok === true){
				res.status(200).send(data_obj);
			}else{
				res.status(res_post.statusCode).send(data_obj);
			}
		});
	});
	req_post.on('error', (e) => {
		console.error(e);
	}
	);
	req_post.write(req_data);
	req_post.end();
});

app.post('/openExternal',(req,res)=>{
	const {url} = req.body;
	if(!url){
		res.status(400).json({ok:false,message:'missing url'});
		return;
	}
	shell.openExternal(url);
	res.status(200).json({ok:true,message:'ok'});
});
app.post('/newWindow',(req,res)=>{
	const {url,width,height} = req.body;
	if(!url){
		res.status(400).json({ok:false,message:'missing url'});
		return;
	}
	const win = new BrowserWindow({
		width: width,
		height: height,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.removeMenu()
	win.loadURL(url);
	res.status(200).json({ok:true,message:'ok'});
});


server.listen(PORT,'0.0.0.0', () => {
	console.log('listening on http://localhost:' + PORT);
});

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600
	})
	win.loadURL(`http://localhost:${PORT}`);
	// Close all windows when the main window is closed
}
AppElectron.whenReady().then(createWindow);