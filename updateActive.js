const fs = require('fs');

function updateSettings(data, socket) {
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
		if (err)
			return console.error(err);
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
			if (err)
				throw err;
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
	fs.readFile(__dirname + '/app/json/umpiresScorers.json', 'utf8', (err) => {
		if (err) {
			console.error(err);
			return;
		}
		const json = { umpires: { HP: { surname: "HP Surname", name: "Name", active: true }, B1: { surname: "1B Surname", name: "Name", active: true }, B2: { surname: "2B Surname", name: "Name", active: true }, B3: { surname: "3B Surname", name: "Name", active: true } }, "scorers": { "head": { surname: "Head Surname", name: "Name", active: true }, "second": { surname: "Second Surname", name: "Name", active: true }, "third": { surname: "Third Surname", name: "Name", active: true } }, "commentators": { "main": { surname: "Sportcaster Surname", name: "Name" }, "technical": { surname: "Technical Surname", name: "Name" } } };
		writeToFile(json, socket, json);
	});
}

module.exports = {
	updateActive,
	updateOfficial,
	resetAllStaff,
	updateSettings
};