const https = require('https');
const fs = require('fs');
const MyBallOptions = {
	"WBSC": {
		hostname: 's3-eu-west-1.amazonaws.com',
		port: 443,
		path:{
			lastPlay: {
				pre: '/game.wbsc.org/gamedata/mbc/',
				post: 't.json'
			},
			data: {
				pre: '/game.wbsc.org/gamedata/mbc/',
				post: '.json'
			}
		},
		method: 'GET'
	},
	"myBallClub": {
		hostname: 's3.amazonaws.com',
		port: 443,
		path:{
			lastPlay: {
				pre: '/cdn1.myballclub.com/game/',
				post: '.txt'
			},
			data: {
				pre: '/cdn1.myballclub.com/game/',
				post: '.json'
			}
		},
		method: 'GET'
	}
};

// Live Updates with FIBS (myBallClub) Private API
function liveUpdate(io) {
	try {
		fs.readFile(__dirname + '/app/json/settings.json', 'utf8', (err, json) => {
			if (err)
				return console.log(err);
			const obj = JSON.parse(json);
			if (obj.fibsStreaming == false)
				return console.log('FIBS Streaming is disabled');
			if (obj.fibsStreamingCode == '')
				return console.log('FIBS Streaming Code is empty');
			let IDfibs = obj.fibsStreamingCode;
			let lastPlay = 1;
			// Open the JSON file containing the last play
			({ lastPlay, IDfibs } = gameCodeRetrive(lastPlay, IDfibs, io));
		});
	} catch (error) { console.log('FIBS update error: ' + error); }
}
function gameCodeRetrive(lastPlay, IDfibs, io) {
	fs.readFile('lastPlay.json', (err, data) => {
		if (err)
			fs.writeFile('lastPlay.json', '0', (err) => {
				if (err)
					throw err; console.log('lastPlay.json created');
			}); // If the file doesn't exist create it and set the last play to 0
		lastPlay = JSON.parse(data);
		// Check the type of the game (WBSC or myBallClub)
		let type = 'myBallClub';
		if ((IDfibs.length == 6 && IDfibs.match(/^[0-9]+$/i)) || IDfibs.startsWith('w')) {
			// Make the request to the WBSC API
			type = 'WBSC';
			IDfibs = IDfibs.replace('w', '');
			// Make the request to the FIBS API
			reqAndUpdate(type, { IDfibs, lastPlay }, io);
		} else {
			// Make the request to get the ID and the play number of the game
			IDfibs = socialGameRetrive(IDfibs, type, lastPlay, io);
		}
		setTimeout(() => { liveUpdate(io); }, 1000);
	});
	return { lastPlay, IDfibs };
}

function socialGameRetrive(IDfibs, type, lastPlay, io) {
	const req_option1 = { hostname: "www.ballclubz.com", port: 443, path: "/live/" + IDfibs, method: "GET" };
	const req1 = https.request(req_option1, async (res1) => {
		if (res1.statusCode == 200) {
			let chunks = '';
			res1.on('data', (data) => { chunks += data; });
			res1.on('end', () => {
				const html = chunks;
				const code = html.substring(html.indexOf("$(document).ready(function () {"), html.indexOf("});")).split('\n').join('').split('\t').join('');
				IDfibs = code.substring(code.indexOf("LoadLiveGame('") + 14, code.indexOf("', '"));
				evGamePlay = code.substring(code.indexOf("', '") + 4, code.indexOf("');"));
				// Make the request to the myBallClub API
				reqAndUpdate(type, { IDfibs, lastPlay, evGamePlay }, io);
			});
		}
		else
			console.log('BallClubZ update error: ' + res1.statusCode);
	});
	req1.end();
	req1.on('error', (e) => { console.log('BallClubZ update error: ' + e); });
	return IDfibs;
}

function reqAndUpdate(type, gameInfo, io) {
	let { IDfibs, lastPlay, evGamePlay = null } = gameInfo;
	let path = pathDefinition(type, IDfibs, "lastPlay", evGamePlay);
	const req = https.request(requestOptionCreation(type, path), (res) => {
		// If the request is successful update the last play (if it is different from the previous one) and request the new data
		lastPlayCheck(res, {lastPlay, IDfibs, type, evGamePlay}, io);
	});
	req.end();
	req.on('error', (e) => { console.log('FIBS update error: ' + e); });
}
function pathDefinition(type, IDfibs, getType = "lastPlay", evGamePlay = null) {
	return MyBallOptions[type].path[getType].pre + IDfibs + (type == "WBSC" ? "" : "/" + (getType == "lastPlay" ? IDfibs : evGamePlay)) + MyBallOptions[type].path[getType].post;
}
function requestOptionCreation(type, path) {
	return { hostname: MyBallOptions[type].hostname, port: MyBallOptions[type].port, path: path, method: MyBallOptions[type].method };
}

function lastPlayCheck(res, gameInfo, io) {
	let { lastPlay, IDfibs, type, evGamePlay } = gameInfo;
	try {
		if (res.statusCode == 200) {
			let chunks = '';
			res.on('data', (data) => { chunks += data; });
			res.on('end', () => {
				const data_obj = JSON.parse(chunks);
				if (data_obj != lastPlay) {
					fs.writeFile('lastPlay.json', JSON.stringify(data_obj), (err) => {
						if (err)
							throw err;
						console.log('lastPlay.json updated');
					});
					requestData({IDfibs, type, evGamePlay}, io);
				}
			});
		}
		else
			console.log(type + ' update error: ' + res.statusCode);
	} catch (error) { console.log(type + ' update error: ' + error); }
}
function requestData(gameInfo, io) {
	let { IDfibs, evGamePlay = null , type} = gameInfo;
	let path = pathDefinition(type, IDfibs, "data", evGamePlay);
	const req = https.request(requestOptionCreation(type, path), (res) => {
		let data = '';
		if (res.statusCode == 200) {
			res.on('data', (data2) => { data += data2; });
			res.on('end', () => {
				updateDataByWBSC(data,io);
			});
		} else { console.log(type + ' data update error: ' + res.statusCode); res.on('data', (data) => { data += data; }); res.on('end', () => { console.log(data); }); }
	});
	req.on('error', (e) => { console.log(type + ' data update error: ' + e); });
	req.end();
}

function updateDataByWBSC(data, io){
	try{
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
				if (err) return console.log(err);
				const oldData = JSON.parse(data);
				const objToSend = { Teams: { Away: { Name: oldData.Teams.Away.Name, Score: AwayRuns !== undefined ? AwayRuns : oldData.Teams.Away.Score, Color: oldData.Teams.Away.Color, Short: oldData.Teams.Away.Short, }, Home: { Name: oldData.Teams.Home.Name, Score: HomeRuns !== undefined ? HomeRuns : oldData.Teams.Home.Score, Color: oldData.Teams.Home.Color, Short: oldData.Teams.Home.Short, } }, Ball: data_obj.balls !== undefined ? data_obj.balls : oldData.Ball, Strike: data_obj.strikes !== undefined ? data_obj.strikes : oldData.Strike, Out: data_obj.outs !== undefined ? data_obj.outs : oldData.Out, Bases: bases, Inning: inning ? inning : oldData.Inning, Arrow: arrow ? arrow : oldData.Arrow, Bases: bases, Int: Object.keys(int).length ? int : oldData.Int };
				fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(objToSend, null, 4), (err) => {
					if (err) return console.error("Error writing to data.json" + err);
					io.emit('update', objToSend);
				});
			});
		}
	}catch(e){ console.log('Error updating data.json: ' + e); }
}

exports.liveUpdate = liveUpdate;
exports.updateDataByWBSC = updateDataByWBSC;