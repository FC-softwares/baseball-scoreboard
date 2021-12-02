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

socket.on('update', function(data){
	document.getElementById('NameAway').value = data.Teams.Away.Name;
	document.getElementById('NameHome').value = data.Teams.Home.Name;
	document.getElementById('ColorAway').value = data.Teams.Away.Color;
	document.getElementById('ColorHome').value = data.Teams.Home.Color;
});
//To add for all the variables
function Ball(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
	socket.emit('update_data', `{"Ball":"${opr}"}`);
	return true;
}
function Strike(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
	socket.emit('update_data', `{"Strike":"${opr}"}`);
	return true;
}
function Out(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
	socket.emit('update_data', `{"Out":"${opr}"}`);
	return true;
}
function Inning(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
	socket.emit('update_data', `{"Inning":"${opr}"}`);
	return true;
}
function TopBot(opr){
	if(opr!="top"&&opr!="bot") return NaN;
	if(opr=="top")
		socket.emit('update_data', `{"Arrow":1}`);
	else
		socket.emit('update_data', `{"Arrow":2}`);
	return true;
}
function Base(base){
	if(base!="1"&&base!="2"&&base!="3")
		return NaN;
	socket.emit('update_data', `{"${base}":"toggle"}`);
	return true;
}
function ScoreHome(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
	socket.emit('update_data', `{"Teams.Home.Score":"${opr}"}`);
	return true;
}
function ScoreAway(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
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