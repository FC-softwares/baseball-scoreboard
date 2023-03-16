const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const socket = io({
	auth: {
		id: user,
		token: token
	}
});
socket.on('connectData', update);
socket.on('update', update);

function update(data){
	if(data?.Teams?.Away?.Name !== undefined)
		document.getElementById('NameAway').value = data.Teams.Away.Name;
	if(data?.Teams?.Home?.Name !== undefined)
		document.getElementById('NameHome').value = data.Teams.Home.Name;
	if(data?.Teams?.Away?.Color !== undefined)
		document.getElementById('ColorAway').value = data.Teams.Away.Color;
	if(data?.Teams?.Home?.Color !== undefined)
		document.getElementById('ColorHome').value = data.Teams.Home.Color;
	if(data?.Ball !== undefined)
		document.getElementById('BallView').value = data.Ball;
	if(data?.Strike !== undefined)
		document.getElementById('StrikeView').value = data.Strike;
	if(data?.Out !== undefined)
		document.getElementById('OutView').value = data.Out;
	if(data?.Inning !== undefined)
		document.getElementById('InningView').value = data.Inning;
	if(data?.Teams?.Home?.Score !== undefined)
		document.getElementById('ScoreHView').value = data.Teams.Home.Score;
	if(data?.Teams?.Away?.Score !== undefined)
		document.getElementById('ScoreAView').value = data.Teams.Away.Score;
	if(data?.Arrow !== undefined){
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
	}
	if(data?.Bases[1] !== undefined){
		if(data.Bases[1]==true){
			document.getElementById("Base1View").classList.remove("btn-outline-primary");
			document.getElementById("Base1View").classList.add("btn-primary");
		}else{
			document.getElementById("Base1View").classList.remove("btn-primary");
			document.getElementById("Base1View").classList.add("btn-outline-primary");
		}
	}
	if(data?.Bases[2] !== undefined){
		if(data.Bases[2]==true){
			document.getElementById("Base2View").classList.remove("btn-outline-primary");
			document.getElementById("Base2View").classList.add("btn-primary");
		}else{
			document.getElementById("Base2View").classList.remove("btn-primary");
			document.getElementById("Base2View").classList.add("btn-outline-primary");
		}
	}
	if(data?.Bases[3] !== undefined){
		if(data.Bases[3]==true){
			document.getElementById("Base3View").classList.remove("btn-outline-primary");
			document.getElementById("Base3View").classList.add("btn-primary");
		}else{
			document.getElementById("Base3View").classList.remove("btn-primary");
			document.getElementById("Base3View").classList.add("btn-outline-primary");
		}
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
