const https = require('https');
const { shell } = require('electron');
const crypto = require('crypto');
const { app, CLIENT, API, reqOption, BrowserWindow, server, PORT, AppElectron, liveUpdate, io } = require("./socket.js");
const fs  = require('fs');
const { checkIDToken, requestActions, guestDeny, checkURL } = require("./checkFunctions.js");

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
	// Check that the URL is a pattern we expect (fc-software.it/{anything}) or (github.com/{anything})
	if (!url.match(/^https?:\/\/(www\.)?fc-software\.it\/.*/) && !url.match(/^https?:\/\/(www\.)?github\.com\/.*/)) {
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
	fs.readFile(__dirname + '/app/json/settings.json', (err, data) => {
		if (err) {
			console.log(err);
			return;
		}
		const settings = JSON.parse(data);
		if(settings.fibsStreaming&&settings.fibsStreamingCode != '')
			liveUpdate(io);
	});
});

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
