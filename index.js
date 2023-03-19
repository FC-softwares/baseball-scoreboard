const env = require('./.env.json')
const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require("socket.io");
const fs = require('fs');
const { shell } = require('electron');
const AppElectron = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const crypto = require('crypto');
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
}

app.use(express.static(__dirname + '/app'));
app.use(express.json({
	verify: (req, res, buf) => {
		req.rawBody = buf
	}
}));

io.on('connection', (socket) => {
	console.log('a user connected\tID: '+socket.id);
	const ver_data = JSON.stringify({
		id: socket.handshake.auth.id,
		token: socket.handshake.auth.token
	});
	socket.on('update_data', (data) => {
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			if(socket.handshake.auth.id == 'guest' && socket.handshake.auth.token == 'guest' && CLIENT == 'DEMO'){
				updateData(data,socket);
			}else{
				const ver_req = https.request(reqOption.checkstat, (ver_res) => {
					ver_res.on('data', (d) => {
						//process.stdout.write(d);
						res_data = JSON.parse(d);
						if (res_data.ok === true) {
							updateData(data,socket);
						}
					});
				});
				ver_req.on('error', (e) => {
					console.error(e);
				});
				ver_req.write(ver_data);
				ver_req.end();
			}
		}else{
			socket.emit('error', 'No auth');
		}
	});

	socket.on('updateSettings', (data) => {
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			if(socket.handshake.auth.id === 'guest' && socket.handshake.auth.token === 'guest' && CLIENT === 'DEMO'){
				updateSettings(data,socket);
			}else{
				const ver_req_set = https.request(reqOption.checkstat, (ver_res) => {
					ver_res.on('data', (d) => {
						//process.stdout.write(d);
						res_data = JSON.parse(d);
						if (res_data.ok === true) {
							updateSettings(data,socket);
						}
					});
				});
				ver_req_set.on('error', (e) => {
					console.error(e);
				});
				ver_req_set.write(ver_data);
				ver_req_set.end();
			}

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
			if(socket.handshake.auth.id === 'guest' && socket.handshake.auth.token === 'guest' && CLIENT === 'DEMO'){
				updateActive(data,socket);
			}else{
				const ver_req_set = https.request(reqOption.checkstat, (ver_res) => {
					ver_res.on('data', (d) => {
						res_data = JSON.parse(d);
						if (res_data.ok === true) {
							// Update The Active Scoreboards List
							updateActive(data,socket);
						}
					});
				});
				ver_req_set.on('error', (e) => {
					console.error(e);
				});
				ver_req_set.write(ver_data);
				ver_req_set.end();
			}
		}
	});
	socket.on('getActive',()=>{
		fs.readFile(__dirname + '/app/json/scoreboards.json', 'utf8', (err, data) => {
			socket.emit('connectActive',data);
		})
	});
	socket.on('updateOffices',(data)=>{
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			if(socket.handshake.auth.id === 'guest' && socket.handshake.auth.token === 'guest' && CLIENT === 'DEMO'){
				updateOfficial(data,socket);
			}else{
				const ver_req_set = https.request(reqOption.checkstat, (ver_res) => {
					ver_res.on('data', (d) => {
						res_data = JSON.parse(d);
						if (res_data.ok === true) {
							// Get and Update The Offices List
							updateOfficial(data,socket);
						}
					});
				});
				ver_req_set.on('error', (e) => {
					console.error(e);
				});
				ver_req_set.write(ver_data);
				ver_req_set.end();
			}
		}
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
	socket.on('Reset_all_staff',()=>{
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			if(socket.handshake.auth.id === 'guest' && socket.handshake.auth.token === 'guest' && CLIENT === 'DEMO'){
				resetAllStaff(socket);
			}else{
				const ver_req_set = https.request(reqOption.checkstat, (ver_res) => {
					ver_res.on('data', (d) => {
						res_data = JSON.parse(d);
						if (res_data.ok === true) {
							resetAllStaff(socket);
						}
					});
				});
				ver_req_set.on('error', (e) => {
					console.error(e);
				});
				ver_req_set.write(ver_data);
				ver_req_set.end();
			}
		}
	});
	socket.on('disconnect', () => {
		console.log('user disconnected\tID: '+socket.id);
	});
});

app.post('/login', (req, res) => {
	const { username, password, remember} = req.body;
	if(!checkIDToken(username,res,password)) return;
	if(username == 'guest' && Buffer.from(password, 'base64').toString('utf8') == 'guest' && CLIENT == 'DEMO'){
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
		res.status(500).json({ok:false,message:'internal server error, please try again later and check your internet connection'});
	});
	req_post.write(req_data);
	req_post.end();
});

app.post('/checkstat', (req, res) => {
	const { id, token } = req.body;
	if(!checkIDToken(id,res,token)) return;
	if(id == 'guest' && token == 'guest' && CLIENT == 'DEMO'){
		res.status(200).json({ok:true,message:'guest',user: {email:'guest@guest.com',name: 'guest',surname:"",isOwner:true}});
		return;
	}else if(id == 'guest' && token == 'guest' && CLIENT != 'DEMO'){
		res.status(400).json({ok:false,message:'invalid token'});
		return;
	}
	const req_data = JSON.stringify({
		id: id,
		token: token
	});
	//make a request to remote APIs
	const req_post = https.request(reqOption.checkstat, (res_post) => {
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
		res.status(500).json({ok:false,message:'internal server error, please try again later and check your internet connection'});
	});
	req_post.write(req_data);
	req_post.end();
});
app.post('/logout', (req, res) => {
	const { id, token } = req.body;
	if(!checkIDToken(id,res,token)) return;
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
		res.status(500).json({ok:false,message:'internal server error, please try again later and check your internet connection'});
	}
	);
	req_post.write(req_data);
	req_post.end();
});
app.post("/getAuthUsers", (req, res) => {
	const { id, token } = req.body;
	if(!checkIDToken(id,res,token)) return;
	if(id == 'guest' && token == 'guest'){
		res.status(200).json({ok:true,message:'guest', users:[{id:'0',name: "guest", surname: "guest", email: "guest@guest.com"}]});
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
		res.status(500).json({ok:false,message:'internal server error, please try again later and check your internet connection'});
	}
	);
	req_post.write(req_data);
	req_post.end();
});

app.post("/addAuthUser", (req, res) => {
	const { id, token, email } = req.body;
	if(!checkIDToken(id, res, token)) return;
	if(!email){
		res.status(400).json({ok:false,message:'missing email'});
		return;
	}
	if(id == 'guest' && token == 'guest'){
		res.status(400).json({ok:false,message:'You can not change the authorized user on the DEMO version'});
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
		res.status(500).json({ok:false,message:'internal server error, please try again later and check your internet connection'});
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
		res.status(400).json({ok:false,message:'You can not change the authorized user on the DEMO version'});
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
		res.status(500).json({ok:false,message:'internal server error, please try again later and check your internet connection'});
	}
	);
	req_post.write(req_data);
	req_post.end();
});

app.post('/openExternal',(req,res)=>{
	const {url} = req.body;
	if(!checkURL(url, res)) return;
	shell.openExternal(url);
	res.status(200).json({ok:true,message:'ok'});
});
app.post('/newWindow',(req,res)=>{
	const {url,width,height} = req.body;
	if(!checkURL(url, res)) return;
	const win = new BrowserWindow({
		width: width,
		height: height,
		useContentSize: true,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.removeMenu()
	win.loadURL(url);
	res.status(200).json({ok:true,message:'ok'});
});

app.get("/README.md", (req, res) => {
	res.sendFile(__dirname + '/README.md');
});
app.get("/client", (req, res) => {
	res.send(CLIENT);
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
	win.on('closed', () => {
		AppElectron.quit();
	});
}
AppElectron.whenReady().then(createWindow);

function checkIDToken(id, res, token) {
	if (!id) {
		res.status(400).json({ ok: false, message: 'missing ID or email' });
		return false;
	}
	if (!token) {
		res.status(400).json({ ok: false, message: 'missing token or password' });
		return false;
	}
	return true;
}

function checkURL(url, res) {
	if (!url) {
		res.status(400).json({ ok: false, message: 'missing url' });
		return false;
	}
	return true;
}
