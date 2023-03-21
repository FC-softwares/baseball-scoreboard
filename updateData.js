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
	switch(indx) {
		case 'Ball':
			if (data_old_obj.Ball < 3) data_old_obj[indx]++, toBeSent.Ball = data_old_obj.Ball;
			break;
		case 'Strike':
			if (data_old_obj.Strike < 2) data_old_obj[indx]++, toBeSent.Strike = data_old_obj.Strike;
			break;
		case 'Out':
			if (data_old_obj.Out < 2) data_old_obj[indx]++, toBeSent.Out = data_old_obj.Out;
			break;
		case 'Teams.Away.Score':
			var { i, ScoreATmp } = scorePlus(data_old_obj, 'Away','A');
			break;
		case 'Teams.Home.Score':
			var { i, ScoreHTmp } = scorePlus(data_old_obj, 'Home','H');
			data_old_obj.Teams.Home.Score = ScoreHTmp;
			break;
		case 'Inning':
			data_old_obj.Inning++, data_old_obj.Int[data_old_obj.Inning] = { A: 0, H: 0 };
			break;
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
	var i, ScoreATmp = 0, ScoreHTmp = 0;
	switch(indx) {
		case 'Teams.Home.Score':
			if (data_old_obj.Int[data_old_obj.Inning].H > 0) data_old_obj.Int[data_old_obj.Inning].H--, data_old_obj.Teams.Home.Score--;
			break;
		case 'Teams.Away.Score':
			if (data_old_obj.Int[data_old_obj.Inning].A > 0) data_old_obj.Int[data_old_obj.Inning].A--, data_old_obj.Teams.Away.Score--;
			break;
		case 'Inning':
			if (data_old_obj.Inning > 1) {
				delete data_old_obj.Int[data_old_obj.Inning], data_old_obj.Inning--;
				for (i = 1; i <= data_old_obj.Inning; i++) ScoreATmp += data_old_obj.Int[i].A, ScoreHTmp += data_old_obj.Int[i].H;
				data_old_obj.Teams.Away.Score = ScoreATmp, data_old_obj.Teams.Home.Score = ScoreHTmp;
			}
			break;
		default:
			if (data_old_obj[indx] > 0) data_old_obj[indx]--, toBeSent[indx] = data_old_obj[indx];
			break;
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
	if (['1', '2', '3'].includes(indx) && toBeSent.Bases === undefined)
		toBeSent.Bases = {};
	switch (indx) {
		case '1':
		case '2':
		case '3':
			toggleBase(data_old_obj, toBeSent, indx);
		break;
		case 'Auto_Change_Inning':
			data_old_obj = { ...data_old_obj, Bases: { 1: false, 2: false, 3: false }, Ball: 0, Strike: 0, Out: 0};
			if (data_old_obj.Arrow === 1) {
				data_old_obj.Arrow = 2;
			} else {
				data_old_obj.Arrow = 1;
				data_old_obj.Inning++;
				data_old_obj.Int[data_old_obj.Inning] = { A: 0, H: 0 };
			}
			toBeSent = { ...toBeSent, Bases: { 1: false, 2: false, 3: false }, Ball: 0, Strike: 0, Out: 0, Arrow: data_old_obj.Arrow, Inning: data_old_obj.Inning, Int: data_old_obj.Int };
		break;
		case 'Reset_All':
			data_old_obj = {Teams: {Away: { Name: 'AWAY', Score: 0, Color: '#000000' },Home: { Name: 'HOME', Score: 0, Color: '#000000' },},Ball: 0,Strike: 0,Out: 0,Inning: 1,Arrow: 1,Bases: { 1: false, 2: false, 3: false },Int: { 1: { A: 0, H: 0 } },};
			toBeSent = data_old_obj;
		break;
		default: break;
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
function updateActive(data, socket) {
	const filepath = __dirname + '/app/json/scoreboards.json';
	fs.readFile(filepath, 'utf8', (err, scoreboard_old) => {
		if (err) return console.error(err);
		const jsonOld = JSON.parse(scoreboard_old);
		const changes = {};
		if (JSON.parse(data).AllOff == true) {
			Object.keys(jsonOld).forEach((indx) => {
				jsonOld[indx] = false;
				changes[indx] = false;
			});
		} else {
			const json = JSON.parse(data);
			Object.entries(json).forEach(([indx, element]) => {
				jsonOld[indx] = element;
				changes[indx] = element;
			});
		}
		fs.writeFile(filepath, JSON.stringify(jsonOld, null, 4), (err) => {
			if (err) throw err;
			const changesJson = JSON.stringify(changes);
			socket.emit('updateActive', changesJson);
			socket.broadcast.emit('updateActive', changesJson);
		});
	});
}

function updateOfficial(data, socket) {
	fs.readFile(__dirname + '/app/json/umpiresScorers.json', 'utf8', (err, umpiresScorers_old) => {
		if (err) {
			console.error(err);
			return;
		}
		const jsonOld = JSON.parse(umpiresScorers_old);
		const changes = {};
		Object.entries(data).forEach(([index, element]) => {
			Object.entries(element).forEach(([index2, element2]) => {
				Object.entries(element2).forEach(([index3, element3]) => {
					if (jsonOld[index][index2][index3] !== element3) {
						jsonOld[index][index2][index3] = element3;
						if (!changes[index])
							changes[index] = {};
						if (!changes[index][index2])
							changes[index][index2] = {};
						changes[index][index2][index3] = element3;
					}
				});
			});
		});
		writeToFile(jsonOld, socket, changes);
	});
}

function writeToFile(jsonOld, socket, changes) {
	fs.writeFile(__dirname + '/app/json/umpiresScorers.json', JSON.stringify(jsonOld, null, 4), (err) => {
		if (err)
			throw err;
		socket.emit('updateOffices', changes);
		socket.broadcast.emit('updateOffices', changes);
	});
}

function resetAllStaff(socket) {
	fs.readFile(__dirname + '/app/json/umpiresScorers.json', 'utf8', (err, ) => {
		if (err) {
			console.error(err);
			return;
		}
		const json = { umpires: { HP: { surname: "HP Surname", name: "Name", active: true },B1: {surname: "1B Surname",name: "Name",active: true },B2: {surname: "2B Surname", name: "Name",active: true }, B3: {surname: "3B Surname", name: "Name",active: true}},"scorers": {"head": { surname: "Head Surname", name: "Name", active: true},"second": { surname: "Second Surname", name: "Name", active: true},"third": { surname: "Third Surname", name: "Name", active: true}},"commentators": {"main": { surname: "Sportcaster Surname", name: "Name"},"technical": { surname: "Technical Surname", name: "Name"}}}
		writeToFile(json, socket, json);
	});
}
exports.updateActive = updateActive;
exports.updateData = updateData;
exports.updateOfficial = updateOfficial;
exports.updateSettings = updateSettings;
exports.resetAllStaff = resetAllStaff;