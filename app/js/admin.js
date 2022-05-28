const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token && user) {
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/checkstat', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}"}`);
	xmlt.onload = function() {
		if (xmlt.status === 200) {
			const response = JSON.parse(xmlt.responseText);
			if (response.ok === false) {
				window.location.href = '/login.html';
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
			socket.emit("getData");
			socket.emit("getActive");
		} else {
			// User is not in a valid session
			// Redirect to login page
			if (xmlt.status === 500) {
				alert('Errore: ' + xmlt.status+"\n"+JSON.parse(xmlt.responseText));
			}
			window.location.href = '/login.html';
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
	}
}else{
	//redirect to login page
	window.location.href = '/login.html';
}

const socket = io({
	auth: {
		id: user,
		token: token
	}
});
socket.on('connectData', update);
socket.on('update', update);

function update(data){
	document.getElementById('NameAway').value = data.Teams.Away.Name;
	document.getElementById('NameHome').value = data.Teams.Home.Name;
	document.getElementById('ColorAway').value = data.Teams.Away.Color;
	document.getElementById('ColorHome').value = data.Teams.Home.Color;
	document.getElementById('BallView').value = data.Ball;
	document.getElementById('StrikeView').value = data.Strike;
	document.getElementById('OutView').value = data.Out;
	document.getElementById('InningView').value = data.Inning;
	document.getElementById('ScoreHView').value = data.Teams.Home.Score;
	document.getElementById('ScoreAView').value = data.Teams.Away.Score;
	if (data.Arrow == 1) {
		document.getElementById("TopView").classList.remove("btn-outline-primary");
		document.getElementById("TopView").classList.add("btn-primary");
		document.getElementById("BotView").classList.remove("btn-primary");
		document.getElementById("BotView").classList.add("btn-outline-primary");
	}else{
		document.getElementById("TopView").classList.remove("btn-primary");
		document.getElementById("TopView").classList.add("btn-outline-primary");
		document.getElementById("BotView").classList.remove("btn-outline-primary");
		document.getElementById("BotView").classList.add("btn-primary");
	}
	if(data.Bases[1]==true){
		document.getElementById("Base1View").classList.remove("btn-outline-primary");
		document.getElementById("Base1View").classList.add("btn-primary");
	}else{
		document.getElementById("Base1View").classList.remove("btn-primary");
		document.getElementById("Base1View").classList.add("btn-outline-primary");
	}
	if(data.Bases[2]==true){
		document.getElementById("Base2View").classList.remove("btn-outline-primary");
		document.getElementById("Base2View").classList.add("btn-primary");
	}else{
		document.getElementById("Base2View").classList.remove("btn-primary");
		document.getElementById("Base2View").classList.add("btn-outline-primary");
	}
	if(data.Bases[3]==true){
		document.getElementById("Base3View").classList.remove("btn-outline-primary");
		document.getElementById("Base3View").classList.add("btn-primary");
	}else{
		document.getElementById("Base3View").classList.remove("btn-primary");
		document.getElementById("Base3View").classList.add("btn-outline-primary");
	}
}
//To add for all the variables
function Ball(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"Ball":"${opr}"}`);
	return true;
}
function Strike(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"Strike":"${opr}"}`);
	return true;
}
function Out(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"Out":"${opr}"}`);
	return true;
}
function Inning(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"Inning":"${opr}"}`);
	return true;
}
function TopBot(opr){
	if(opr!="top"&&opr!="bot") 
		return null;
	if(opr=="top")
		socket.emit('update_data', `{"Arrow":1}`);
	else
		socket.emit('update_data', `{"Arrow":2}`);
	return true;
}
function Base(base){
	if(base!="1"&&base!="2"&&base!="3")
		return null;
	socket.emit('update_data', `{"${base}":"toggle"}`);
	return true;
}
function ScoreHome(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"Teams.Home.Score":"${opr}"}`);
	return true;
}
function ScoreAway(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"Teams.Away.Score":"${opr}"}`);
	return true;
}
function Update_Data(){
	NameA = document.getElementById('NameAway').value;
	NameH = document.getElementById('NameHome').value;
	ColorA = document.getElementById('ColorAway').value;
	ColorH = document.getElementById('ColorHome').value;

	socket.emit('update_data',`{"Teams.Away.Name":"${NameA}","Teams.Home.Name":"${NameH}","Teams.Away.Color":"${ColorA}","Teams.Home.Color":"${ColorH}"}`);
	return true;
}
function New_Batter(){
	socket.emit('update_data',`{"Ball":"0","Strike":"0"}`);
	return true;
}
function Auto_Change_Inning(){
	socket.emit('update_data',`{"Auto_Change_Inning":"toggle"}`);
	return true;
}
function Reset_All(){
	socket.emit('update_data',`{"Reset_All":"toggle"}`);
	return true;
}

// Animation and Scoreboard controls
socket.on('updateActive', updateActive);
socket.on('connectActive', updateActive);

function updateActive(data){
	const dataObj = JSON.parse(data);
	Object.entries(dataObj).forEach(([key, value]) => {
		if(key=="main"){
			if(value==true){
				document.getElementById('mainOn').classList.remove("btn-outline-primary");
				document.getElementById('mainOn').classList.add("btn-primary");
				document.getElementById('mainOff').classList.remove("btn-primary");
				document.getElementById('mainOff').classList.add("btn-outline-primary");
			}else{
				document.getElementById('mainOn').classList.remove("btn-primary");
				document.getElementById('mainOn').classList.add("btn-outline-primary");
				document.getElementById('mainOff').classList.remove("btn-outline-primary");
				document.getElementById('mainOff').classList.add("btn-primary");
			}
		}else if (key=="pre") {
			if(value==true){
				document.getElementById('preOn').classList.remove("btn-outline-primary");
				document.getElementById('preOn').classList.add("btn-primary");
				document.getElementById('preOff').classList.remove("btn-primary");
				document.getElementById('preOff').classList.add("btn-outline-primary");
			}else{
				document.getElementById('preOn').classList.remove("btn-primary");
				document.getElementById('preOn').classList.add("btn-outline-primary");
				document.getElementById('preOff').classList.remove("btn-outline-primary");
				document.getElementById('preOff').classList.add("btn-primary");
			}
		}else if (key=="post") {
			if(value==true){
				document.getElementById('postOn').classList.remove("btn-outline-primary");
				document.getElementById('postOn').classList.add("btn-primary");
				document.getElementById('postOff').classList.remove("btn-primary");
				document.getElementById('postOff').classList.add("btn-outline-primary");
			}else{
				document.getElementById('postOn').classList.remove("btn-primary");
				document.getElementById('postOn').classList.add("btn-outline-primary");
				document.getElementById('postOff').classList.remove("btn-outline-primary");
				document.getElementById('postOff').classList.add("btn-primary");
			}
		}else if (key=="inning") {
			if(value==true){
				document.getElementById('inningOn').classList.remove("btn-outline-primary");
				document.getElementById('inningOn').classList.add("btn-primary");
				document.getElementById('inningOff').classList.remove("btn-primary");
				document.getElementById('inningOff').classList.add("btn-outline-primary");
			}else{
				document.getElementById('inningOn').classList.remove("btn-primary");
				document.getElementById('inningOn').classList.add("btn-outline-primary");
				document.getElementById('inningOff').classList.remove("btn-outline-primary");
				document.getElementById('inningOff').classList.add("btn-primary");
			}
		}
	});
}
function main(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"main":${opr}}`);
	return true;
}
function preGame(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"pre":${opr}}`);
	return true;
}
function postGame(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"post":${opr}}`);
	return true;
}
function inning(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"inning":${opr}}`);
	return true;
}