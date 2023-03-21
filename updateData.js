const fs = require('fs');
const { updateActive, updateOfficial, updateSettings, resetAllStaff } = require("./updateActive");

function updateData(data,socket){
	fs.readFile(__dirname + '/app/json/data.json', 'utf8', (err, data_old) => {
		if (err) throw err;
		var json = JSON.parse(data), data_old_obj = JSON.parse(data_old), toBeSent = {};
		Object.entries(json).forEach(entry => {
			const [indx, element] = entry;
			switch (element) {
			case '+':plusChanges(indx, data_old_obj, toBeSent);break;
			case '-':minusChanges(indx, data_old_obj, toBeSent);break;
			case '0':zeroChanges(indx, data_old_obj, toBeSent);break;
			case 'toggle':({ data_old_obj, toBeSent } = toggleChanges(indx, data_old_obj, toBeSent));break;
			default:
				if (indx.startsWith('Teams.') && indx.endsWith('.Name')) ({ data_old_obj, toBeSent } = nameColorChange(data_old_obj, element, toBeSent, indx.split('.')[1] + '.' + indx.split('.')[2]));
				else if (indx.startsWith('Teams.') && indx.endsWith('.Color')) ({ data_old_obj, toBeSent } = nameColorChange(data_old_obj, element, toBeSent, indx.split('.')[1] + '.' + indx.split('.')[2]));
				else {
				data_old_obj[indx] = element;
				toBeSent[indx] = element;
				}
			}
		});
		toBeSent = {...toBeSent,Teams: {...toBeSent?.Teams,Away: {...toBeSent?.Teams?.Away,Score: data_old_obj.Teams.Away.Score,},Home: {...toBeSent?.Teams?.Home,Score: data_old_obj.Teams.Home.Score,},},Int: data_old_obj.Int,Inning: data_old_obj.Inning,}
		fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(data_old_obj, null, 4), (err) => {if (err)  throw err;});
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
			minusScore(data_old_obj, 'Home', 'H', toBeSent);
			break;
		case 'Teams.Away.Score':
			minusScore(data_old_obj, 'Away', 'A', toBeSent);
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


function minusScore(data_old_obj, team, short) {
	if (data_old_obj.Int[data_old_obj.Inning][short] > 0) {
		data_old_obj.Int[data_old_obj.Inning][short]--
		data_old_obj.Teams[team].Score--;
	}
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
			toggleBase(data_old_obj, toBeSent, indx);break;
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

exports.updateActive = updateActive;
exports.updateData = updateData;
exports.updateOfficial = updateOfficial;
exports.updateSettings = updateSettings;
exports.resetAllStaff = resetAllStaff;