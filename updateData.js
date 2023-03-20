const fs = require('fs');

function updateData(data,socket){
	fs.readFile(__dirname + '/app/json/data.json', 'utf8', (err, data_old) => {
		if (err)
			throw err;
		var json = JSON.parse(data);
		var data_old_obj = JSON.parse(data_old);
		var toBeSent = {};
		Object.entries(json).forEach(entry => {
			const [indx, element] = entry;
			if (element === '+') {
				plusChanges(indx, data_old_obj, toBeSent);
			} else if (element === '-') {
				minusChanges(indx, data_old_obj, toBeSent);
			} else if (element === '0') {
				zeroChanges(indx, data_old_obj, toBeSent);
			} else if (element === 'toggle') {
				({ data_old_obj, toBeSent } = toggleChanges(indx, data_old_obj, toBeSent));
			} else if (indx === 'Teams.Away.Name' || indx == 'Teams.Home.Name' || indx == 'Teams.Away.Color' || indx == 'Teams.Home.Color') {
				({ data_old_obj, toBeSent } = nameColorChange(data_old_obj, element, toBeSent, indx.split('.')[1] + '.' + indx.split('.')[2]));
			}else{
				data_old_obj[indx] = element;
				toBeSent[indx] = element;
			}
		});
		toBeSent = {
			...toBeSent,
			Teams: {
				...toBeSent?.Teams,
				Away: {
					...toBeSent?.Teams?.Away,
					Score: data_old_obj.Teams.Away.Score,
				},
				Home: {
					...toBeSent?.Teams?.Home,
					Score: data_old_obj.Teams.Home.Score,
				},
			},
			Int: data_old_obj.Int,
			Inning: data_old_obj.Inning,
		}
		fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(data_old_obj, null, 4), (err) => {
			if (err)
				throw err;
		});
		socket.emit('update', toBeSent);
		socket.broadcast.emit('update', toBeSent);
	});
}

function nameColorChange(data_old_obj, element, toBeSent, mix) {
	const [team, nameOrColor] = mix.split('.');
	data_old_obj.Teams[team][nameOrColor] = element;
	if (toBeSent.Teams === undefined)
		toBeSent.Teams = {};
	if (toBeSent.Teams[team] === undefined)
		toBeSent.Teams[team] = {};
	toBeSent.Teams[team][nameOrColor] = element;
	return { data_old_obj, toBeSent };
}

function plusChanges(indx, data_old_obj, toBeSent) {
	if (indx === 'Ball' && data_old_obj.Ball < 3) {
		data_old_obj[indx] = data_old_obj[indx] + 1;
		toBeSent.Ball = data_old_obj.Ball;
	} else if (indx === 'Strike' && data_old_obj.Strike < 2) {
		data_old_obj[indx]++;
		toBeSent.Strike = data_old_obj.Strike;
	} else if (indx === 'Out' && data_old_obj.Out < 2) {
		data_old_obj[indx]++;
		toBeSent.Out = data_old_obj.Out;
	} else if (indx === 'Teams.Away.Score') {
		var { i, ScoreATmp } = scorePlus(data_old_obj, 'Away','A');
	} else if (indx === 'Teams.Home.Score') {
		var { i, ScoreHTmp } = scorePlus(data_old_obj, 'Home','H');
		data_old_obj.Teams.Home.Score = ScoreHTmp;
	} else if (indx === 'Inning') {
		data_old_obj.Inning++;
		data_old_obj.Int[data_old_obj.Inning] = { A: 0, H: 0 };
	}
	return { ScoreATmp, ScoreHTmp, i };
}

function scorePlus(data_old_obj, team,short) {
	data_old_obj.Int[data_old_obj.Inning][short]++;
	var ScoreATmp = 0;
	for (var i = 1; i <= data_old_obj.Inning; i++) {
		ScoreATmp += data_old_obj.Int[i][short];
	}
	data_old_obj.Teams[team].Score = ScoreATmp;
	let ScoreHTmp = ScoreATmp;
	return { i, ScoreATmp, ScoreHTmp };
}

function minusChanges(indx, data_old_obj, toBeSent) {
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
	} else if (data_old_obj[indx] > 0) {
		data_old_obj[indx]--;
		toBeSent[indx] = data_old_obj[indx];
	}
	return { ScoreATmp, ScoreHTmp, i };
}

function zeroChanges(indx, data_old_obj, toBeSent) {
	if (indx === 'Inning') {
		data_old_obj[indx] = 1;
		data_old_obj.Int = { 1: { A: 0, H: 0 } };
		data_old_obj.Teams.Away.Score = 0;
		data_old_obj.Teams.Home.Score = 0;
		toBeSent.Int = data_old_obj.Int;
		toBeSent.Teams = {...toBeSent?.Teams,Away: {...toBeSent?.Teams?.Away,Score: 0},Home: {...toBeSent?.Teams?.Home,Score: 0}};
		toBeSent.Inning = data_old_obj.Inning;
	} else if (indx === 'Teams.Away.Score') {
		zeroScore(data_old_obj, 'Away', 'A');
	} else if (indx === 'Teams.Home.Score') {
		zeroScore(data_old_obj, 'Home', 'H');
	} else {
		data_old_obj[indx] = 0;
		toBeSent[indx] = data_old_obj[indx];
	}
	return;
}

function zeroScore(data_old_obj, team, short) {
	data_old_obj.Teams[team].Score = 0;
	for (var i = 1; i <= data_old_obj.Inning; i++)
		data_old_obj.Int[i][short] = 0;
	return;
}

function toggleChanges(indx, data_old_obj, toBeSent) {
	if((indx === '1' || indx === '2' || indx === '3') && toBeSent.Bases === undefined) toBeSent.Bases = {};
	if (indx === '1') {
		toggleBase(data_old_obj, toBeSent, 1);
	} else if (indx === '2') {
		toggleBase(data_old_obj, toBeSent, 2);
	} else if (indx === '3') {
		toggleBase(data_old_obj, toBeSent, 3);
	} else if (indx === 'Auto_Change_Inning') {
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
		if (toBeSent.Bases === undefined)
			toBeSent.Bases = {};
		toBeSent.Bases[1] = data_old_obj.Bases[1];
		toBeSent.Bases[2] = data_old_obj.Bases[2];
		toBeSent.Bases[3] = data_old_obj.Bases[3];
		toBeSent.Ball = data_old_obj.Ball;
		toBeSent.Strike = data_old_obj.Strike;
		toBeSent.Out = data_old_obj.Out;
		toBeSent.Arrow = data_old_obj.Arrow;
		toBeSent.Inning = data_old_obj.Inning;
		toBeSent.Int = data_old_obj.Int;
	} else if (indx === 'Reset_All') {
		data_old_obj = { "Teams": { "Away": { "Name": "AWAY", "Score": 0, "Color": "#000000" }, "Home": { "Name": "HOME", "Score": 0, "Color": "#000000" } }, "Ball": 0, "Strike": 0, "Out": 0, "Inning": 1, "Arrow": 1, "Bases": { "1": false, "2": false, "3": false }, "Int": { "1": { "A": 0, "H": 0 } } };
		toBeSent = data_old_obj;
	}
	return { data_old_obj, toBeSent };
}

function toggleBase(data_old_obj, toBeSent, indx) {
	data_old_obj.Bases[indx] = !data_old_obj.Bases[indx];
	toBeSent.Bases[indx] = data_old_obj.Bases[indx];
}

function updateSettings(data,socket) {
	fs.readFile(__dirname + '/app/json/settings.json', 'utf8', (err, data_old) => {
		if (err)
			throw err;
		var json = JSON.parse(data);
		var data_old_obj = JSON.parse(data_old);
		Object.entries(json).forEach(entry => {
			const [indx, element] = entry;
			switch (element) {
				default:
					data_old_obj[indx] = element;
					break;
			}
		});
		fs.writeFile(__dirname + '/app/json/settings.json', JSON.stringify(data_old_obj, null, 4), (err) => {
			if (err)
				throw err;
		});
		socket.emit('updateSettings', data_old_obj);
		socket.broadcast.emit('updateSettings', data_old_obj);
	});
}
function updateActive(data,socket) {
	fs.readFile(__dirname + '/app/json/scoreboards.json', 'utf8', (err, scoreboard_old) => {
		if (err) {
			console.error(err);
			return;
		}
		var jsonOld = {};
		var changes = {};
		if(JSON.parse(data).AllOff == true){
			jsonOld = { main: false, pre: false,post: false,inning: false,umpires: false,scorers: false,commentator: false,technicalComment: false}
			changes = jsonOld;
		}else{
			var json = JSON.parse(data);
			jsonOld = JSON.parse(scoreboard_old);
			changes = {};
			// Compare The Old Scoreboard With The New Scoreboard and save the changes
			Object.entries(json).forEach(entry => {
				const [indx, element] = entry;
				if (element == true) {
					jsonOld[indx] = true;
					changes[indx] = true;
				} else {
					jsonOld[indx] = false;
					changes[indx] = false;
				}
			});
		}
		fs.writeFile(__dirname + '/app/json/scoreboards.json', JSON.stringify(jsonOld, null, 4), (err) => {
			if (err)
				throw err;
			const changesJson = JSON.stringify(changes);
			socket.emit('updateActive', changesJson);
			socket.broadcast.emit('updateActive', changesJson);
		});
	});
}
function updateOfficial(data,socket) {
	fs.readFile(__dirname + '/app/json/umpiresScorers.json', 'utf8', (err, umpiresScorers_old) => {
		if (err) {
			console.error(err);
			return;
		}
		var jsonOld = JSON.parse(umpiresScorers_old);
		var changes = {};
		// Compare The Old offices list With The New offices list and save the changes
		Object.entries(data).forEach(entry => {
			const [indx, element] = entry;
			Object.entries(element).forEach(entry2 => {
				const [indx2, element2] = entry2;
				Object.entries(element2).forEach(entry3 => {
					const [indx3, element3] = entry3;
					if (jsonOld[indx][indx2][indx3] != element3) {
						jsonOld[indx][indx2][indx3] = element3;
						if (!changes[indx])
							changes[indx] = {};
						if (!changes[indx][indx2])
							changes[indx][indx2] = {};
						changes[indx][indx2][indx3] = element3;
					}
				});
			});
		});
		fs.writeFile(__dirname + '/app/json/umpiresScorers.json', JSON.stringify(jsonOld, null, 4), (err) => {
			if (err)
				throw err;
			socket.emit('updateOffices', changes);
			socket.broadcast.emit('updateOffices', changes);
		});
	});
}

function resetAllStaff(socket) {
	fs.readFile(__dirname + '/app/json/umpiresScorers.json', 'utf8', (err, ) => {
		if (err) {
			console.error(err);
			return;
		}
		const json = { umpires: { HP: { surname: "HP Surname", name: "Name", active: true },B1: {surname: "1B Surname",name: "Name",active: true },B2: {surname: "2B Surname", name: "Name",active: true }, B3: {surname: "3B Surname", name: "Name",active: true}},"scorers": {"head": { surname: "Head Surname", name: "Name", active: true},"second": { surname: "Second Surname", name: "Name", active: true},"third": { surname: "Third Surname", name: "Name", active: true}},"commentators": {"main": { surname: "Sportcaster Surname", name: "Name"},"technical": { surname: "Technical Surname", name: "Name"}}}
		fs.writeFile(__dirname + '/app/json/umpiresScorers.json', JSON.stringify(json, null, 4), (err) => {
			if (err)
				throw err;
			socket.emit('updateOffices', json);
			socket.broadcast.emit('updateOffices', json);
		});
	});
}
exports.updateActive = updateActive;
exports.updateData = updateData;
exports.updateOfficial = updateOfficial;
exports.updateSettings = updateSettings;
exports.resetAllStaff = resetAllStaff;