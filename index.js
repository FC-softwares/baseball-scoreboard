const https = require('https');
const { shell } = require('electron');
const crypto = require('crypto');
const { app, CLIENT, API, reqOption, BrowserWindow, server, PORT, AppElectron, io } = require("./socket.js");
const fs  = require('fs');

const idFIBS = "105226" //FIBS ID (TEST) will be removed in production and added a new field in settings.json

if(require('electron-squirrel-startup')) return AppElectron.quit();

app.post('/login', (req, res) => {
	const { username, password, remember } = req.body;
	if (!checkIDToken(username, res, password))
		return;
	if (username == 'guest' && Buffer.from(password, 'base64').toString('utf8') == 'guest' && CLIENT == 'DEMO') {
		res.status(200).json({ ok: true, message: 'login success', id: "guest", token: 'guest' });
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
		requestActions(res_post, res, req_post);
	});
	req_post.end(req_data);
});
app.post('/checkstat', (req, res) => {
	const { id, token } = req.body;
	if (!checkIDToken(id, res, token)) return;
	if (id == 'guest' && token == 'guest' && CLIENT == 'DEMO') {
		res.status(200).json({ ok: true, message: 'guest', user: { email: '', name: 'guest', surname: "", isOwner: true, team: "DEMO" } });
		return;
	} else if (CLIENT !== 'DEMO'&&id == 'guest' && token == 'guest') {
		res.status(400).json({ ok: false, message: 'invalid token' });
		return;
	}
	const req_data = JSON.stringify({
		id: id,
		token: token
	});
	//make a request to remote APIs
	const req_post = https.request(reqOption.checkstat, (res_post) => {
		requestActions(res_post, res, req_post);
	});
	req_post.end(req_data);
});
app.post('/logout', (req, res) => {
	const { id, token } = req.body;
	if (!checkIDToken(id, res, token)) return;
	if (id == 'guest' && token == 'guest' && CLIENT === 'DEMO') {
		res.status(200).json({ ok: true, message: 'guest' });
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
		requestActions(res_post, res, req_post);
	});
	req_post.end(req_data);
});
app.post("/getAuthUsers", (req, res) => {
	const { id, token } = req.body;
	if (!checkIDToken(id, res, token)) return;
	if (id == 'guest' && token == 'guest') {
		res.status(200).json({ ok: true, message: 'guest', users: [{ id: '0', name: "guest", surname: "guest", email: "", team: "DEMO"}] });
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
		requestActions(res_post, res, req_post);
	});
	req_post.end(req_data);
});
app.post("/addAuthUser", (req, res) => {
	const { id, token, email } = req.body;
	if (!checkIDToken(id, res, token)) return;
	if (!email) {
		res.status(400).json({ ok: false, message: 'missing email' });
		return;
	}
	if(!guestDeny(id, token, res)) return;
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
		requestActions(res_post, res, req_post);
	});
	req_post.end(req_data);
});
app.post("/removeAuthUser", (req, res) => {
	const { id, token, user_id } = req.body;
	if (!checkIDToken(id, res, token)) return;
	if (!user_id) {
		res.status(400).json({ ok: false, message: 'missing user_id' });
		return;
	}
	if(!guestDeny(id, token, res)) return;
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
		requestActions(res_post, res, req_post);
	});
	req_post.end(req_data);
});
app.post('/openExternal', (req, res) => {
	const { url } = req.body;
	if (!checkURL(url, res))
		return;
	// Check that the URL is a pattern we expect
	if (!url.match(/^https?:\/\/(www\.)?facchini-pu\.it/)) {
		res.status(400).json({ok:false,message:'invalid url'});
		return;
	}
	// convert the url to a redirect free url (remove the redirect query param)
	const redirectFreeUrl = url.replace(/redirect=1&?/,'');
	shell.openExternal(redirectFreeUrl);
	res.status(200).json({ok:true,message:'ok'});
});
app.post('/newWindow', (req, res) => {
	const { url, width, height } = req.body;
	if (!checkURL(url, res))
		return;
	const win = new BrowserWindow({
		width: width,
		height: height,
		useContentSize: true,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.removeMenu();
	win.loadURL(url);
	res.status(200).json({ ok: true, message: 'ok' });
});
app.get("/README.md", (req, res) => {
	res.sendFile(__dirname + '/README.md');
});
app.get("/client", (req, res) => {
	res.send(CLIENT);
});
server.listen(PORT, '0.0.0.0', () => {
	console.log('listening on http://localhost:' + PORT);
	if(idFIBS){
		console.log('live update on ' + idFIBS);
		liveUpdate(idFIBS);
	}
});

// Live Updates with FIBS (myBallClub) Private API
function liveUpdate(IDfibs) {
	let lastPlay = 1;
	// Open the JSON file containing the last play
	fs.readFile('lastPlay.json', (err, data) => {
		if (err){
			// Create the file if it does not exist
			fs.writeFile('lastPlay.json', '0', (err) => {
				if (err) throw err;
				console.log('lastPlay.json created');
			});
		}
		lastPlay = JSON.parse(data);
	});
	// Make the request to the FIBS API
	const req_option = {
		hostname: 's3-eu-west-1.amazonaws.com',
		port: 443,
		path: '/game.wbsc.org/gamedata/' + IDfibs + '/latest.json',
		method: 'GET'
	};
	const req = https.request(req_option, (res) => {
		// If the request is successful update the last play (if it is different from the previous one) and request the new data
		if (res.statusCode == 200) {
			res.on('data', (data) => {
				const data_obj = JSON.parse(data);
				if (data_obj != lastPlay) {
					fs.writeFile('lastPlay.json', JSON.stringify(data_obj), (err) => {
						if (err) throw err;
						console.log('lastPlay.json updated');
					});
					requestData(IDfibs, data_obj);
				}
			});
		}else{
			console.log('FIBS update error: ' + res.statusCode);
		}
	});
	req.end();
	setTimeout(liveUpdate, 1000, IDfibs);
}

function requestData(IDfibs, lastPlay) {
	// Make the request to the FIBS API
	const req_option = {
		hostname: 's3-eu-west-1.amazonaws.com',
		port: 443,
		path: '/game.wbsc.org/gamedata/' + IDfibs + '/play' + lastPlay + '.json',
		method: 'GET'
	};
	const req = https.request(req_option, (res) => {
		if(res.statusCode == 200){
			console.log('FIBS data updated');
			let data = '';
			res.on('data', (data2) => {
				data += data2;
			});
			res.on('end', () => {
				// Update the last play
				const data_obj = JSON.parse(data);
				const sitaution = data_obj.situation;
				const AwayRuns = data_obj.linescore.awaytotals.R;
				const HomeRuns = data_obj.linescore.hometotals.R;
				// Remove the index 0 on the arrays
				const awayRunsParz = data_obj.linescore.awayruns
				const homeRunsParz = data_obj.linescore.homeruns
				const bases = {
					1: sitaution.runner1 ? true : false,
					2: sitaution.runner2 ? true : false,
					3: sitaution.runner3 ? true : false,
				}
				// The currentinning is in the fortmat {[TOP|BOT] #} take the number
				const inning = parseInt(sitaution.currentinning.split(" ")[1]);
				// The arrow is 1 on TOP and 2 on BOT
				const arrow = sitaution.currentinning.split(" ")[0] == "TOP" ? 1:2;
				// Destructuring the play and creating the new format for app/json/data.json
				var int = {};
				for(let i=1;i<=inning;i++){
					int[i] = {
						A: awayRunsParz[i]!=undefined ? awayRunsParz[i]:0,
						H: homeRunsParz[i]!=undefined ? homeRunsParz[i]:0
					}
				}
				console.log(int,int.equals({}));
				fs.readFile(__dirname + '/app/json/data.json', (err,data)=>{
					if(err) throw err;
					const oldData = JSON.parse(data);
					const objToSend = {
						Teams:{
							Away:{
								Name: oldData.Teams.Away.Name,
								Score: AwayRuns,
								Color: oldData.Teams.Away.Color,
								Short: oldData.Teams.Away.Short,
							},
							Home:{
								Name: oldData.Teams.Home.Name,
								Score: HomeRuns,
								Color: oldData.Teams.Home.Color,
								Short: oldData.Teams.Home.Short,
							}
						},
						Ball: sitaution.balls ? sitaution.balls : oldData.Ball,
						Strike: sitaution.strikes ? sitaution.strikes : oldData.Strike,
						Out: sitaution.outs ? sitaution.outs : oldData.Out,
						Bases: bases,
						Inning: inning ? inning : oldData.Inning,
						Arrow: arrow ? inning : oldData.Arrow,
						Bases: bases,
						Int: Object.keys(int).length ? int : oldData.Int
					}
					fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(objToSend,null,4), (err) =>{
						if (err) return console.error("Error writing to data.json" + err);
						io.emit('update',objToSend);
					});
				});
			});
		}else{
			console.log('FIBS data update error: ' + res.statusCode);
			let chunk = '';
			res.on('data', (data) => {
				chunk += data;
			});
			res.on('end', () => {
				console.log(chunk);
			});
		}
	});
	req.end();
}

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600
	});
	win.loadURL(`http://localhost:${PORT}`);
	// Close all windows when the main window is closed
	win.on('closed', () => {
		AppElectron.quit();
	});
};
AppElectron.whenReady().then(createWindow);
function guestDeny(id, token, res) {
	if (id == 'guest' && token == 'guest') {
		res.status(400).json({ ok: false, message: 'You can not change the authorized user on the DEMO version' });
		return false;
	}
	return true;
}
function requestActions(res_post, res, req_post) {
	res_post.on('data', (data) => {
		const data_obj = JSON.parse(data);
		if (data_obj.ok === true) {
			res.status(200).send(data_obj);
		} else {
			res.status(res_post.statusCode).send(data_obj);
		}
	});
	req_post.on('error', (e) => {
		console.error(e);
		res.status(500).json({ ok: false, message: 'internal server error, please try again later and check your internet connection' });
	});
}

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
