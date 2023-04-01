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

// Constant URL to not set logo image to be used by @TheTecnoKing soon
// @TheTecnoKing if you are reading this, please delete this comment and add the URL to the image you want to use
// This dose not mean this is the image displayed on the scoreboard, this is just a placeholder for the control panel
const notSetLogoURL = "https://dummyimage.com/100x100/000000/ffffff.png&text=LOGO+NON+IMPOSTATO";

function update(data){
	setNumberView(data?.Teams?.Away?.Name, "NameAway");
	setNumberView(data?.Teams?.Home?.Name, "NameHome");
	setNumberView(data?.Teams?.Away?.Color, "ColorAway");
	setNumberView(data?.Teams?.Home?.Color, "ColorHome");
	setNumberView(data?.Teams?.Home?.Score, "ScoreH");
	setNumberView(data?.Teams?.Away?.Score, "ScoreA");
	setNumberView(data?.Ball, "Ball");
	setNumberView(data?.Strike, "Strike");
	setNumberView(data?.Out, "Out");
	setNumberView(data?.Inning, "Inning");
	if(data?.Arrow !== undefined){
		if (data.Arrow == 1) {
			setArrowPart("Top",true);
			setArrowPart("Bot",false);
		}else{
			setArrowPart("Top",false);
			setArrowPart("Bot",true);
		}
	}
	if(data?.Bases !== undefined){
		setViewBase(data?.Bases[1],"Base1View");
		setViewBase(data?.Bases[2],"Base2View");
		setViewBase(data?.Bases[3],"Base3View");
	}
	if(data?.Teams?.Away?.Logo !== undefined && data?.Teams?.Away?.Logo !== "")
		try{ document.getElementById("LogoAwayView").src = data?.Teams?.Away?.Logo?.replaceAll(/[\n'"]/g,'')} catch(err){console.log(err)}
	else if (data?.Teams?.Away?.Logo !== undefined)
		try{ document.getElementById("LogoAwayView").src = notSetLogoURL;} catch(err){console.log(err)};
	if(data?.Teams?.Home?.Logo !== undefined && data?.Teams?.Home?.Logo !== "")
		try{ document.getElementById("LogoHomeView").src = data?.Teams?.Home?.Logo?.replaceAll(/[\n'"]/g,'')} catch(err){console.log(err)}
	else if (data?.Teams?.Home?.Logo !== undefined)
		try{ document.getElementById("LogoHomeView").src = notSetLogoURL;} catch(err){console.log(err)};
}
function setArrowPart(part,active) {
	if (active){
		document.getElementById(part+"View").classList.remove("btn-outline-primary");
		document.getElementById(part+"View").classList.add("btn-primary");
	}else {
		document.getElementById(part+"View").classList.remove("btn-primary");
		document.getElementById(part+"View").classList.add("btn-outline-primary");
	}
}

function setNumberView(number,id) {
	try{
		if (number !== undefined)
			document.getElementById(id+'View').value = number;
	}catch(err){
		console.log(err, id);
	}
}

function setViewBase(base,id) {
	if (base !== undefined) {
		if (base == true) {
			document.getElementById(id).classList.remove("btn-outline-primary");
			document.getElementById(id).classList.add("btn-primary");
		} else {
			document.getElementById(id).classList.remove("btn-primary");
			document.getElementById(id).classList.add("btn-outline-primary");
		}
	}
}

//To add for all the variables
function updateNumber(opr, id){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return null;
	socket.emit('update_data', `{"${id}":"${opr}"}`);
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
async function Update_Data(){
	NameA = document.getElementById('NameAwayView').value;
	NameH = document.getElementById('NameHomeView').value;
	ColorA = document.getElementById('ColorAwayView').value;
	ColorH = document.getElementById('ColorHomeView').value;
	let obj = {
		"Teams.Away.Name":NameA,
		"Teams.Home.Name":NameH,
		"Teams.Away.Color":ColorA,
		"Teams.Home.Color":ColorH
	}
	if(document.getElementById('LogoAway')?.files[0] !== undefined)
		obj["Teams.Away.Logo"] = await fileToBase64(document.getElementById('LogoAway').files[0]);
	if(document.getElementById('LogoHome')?.files[0] !== undefined)
		obj["Teams.Home.Logo"] = await fileToBase64(document.getElementById('LogoHome').files[0]);
	if(document.getElementById('LogoAwayClear')?.value == "remove")
		obj["Teams.Away.Logo"] = "";
	if(document.getElementById('LogoHomeClear')?.value == "remove")
		obj["Teams.Home.Logo"] = "";
	socket.emit('update_data', obj);
	return true;
}
function setImageSrcFromInput(input, image) {
	if(input?.files === undefined){
		try{document.getElementById(image).src = notSetLogoURL;}catch(err){console.log(err)}
		try{document.getElementById(image.replace("View","")).value = "";}catch(err){console.log(err)}
		try{input.value = "remove";}catch(err){console.log(err)}
		return;
	}
	const file = input.files[0];
	const reader = new FileReader();
	reader.onload = () => {
		try{document.getElementById(image).src = reader.result;}catch(err){console.log(err)}
		try{document.getElementById(image.replace("View","")+"Clear").value = "";}catch(err){console.log(err)}
	};
	reader.readAsDataURL(file);
}

function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
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
