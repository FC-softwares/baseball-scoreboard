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

const notSetLogoURL = "img/baseball-ball.png";

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
	if(data?.Arrow !== undefined && data.Arrow == 1) {
			setArrowPart("Top",true);
			setArrowPart("Bot",false);
	}else if (data?.Arrow !== undefined) {
		setArrowPart("Top",false);
		setArrowPart("Bot",true);
	}
	if(data?.Bases !== undefined){
		setViewBase(data?.Bases[1],"Base1View");
		setViewBase(data?.Bases[2],"Base2View");
		setViewBase(data?.Bases[3],"Base3View");
	}
	updateLogo(data?.Teams?.Away?.Logo, "LogoAwayView");
	updateLogo(data?.Teams?.Home?.Logo, "LogoHomeView");
}
function updateLogo(logo, id){
	try{
		if (logo !== undefined && logo !== "")
			document.getElementById(id).src = logo?.replaceAll(/[\n'"]/g, '');
		else if (logo !== undefined)
			document.getElementById(id).src = notSetLogoURL;
	} catch (err) { console.log(err); };
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
		try{
			document.getElementById(image).src = notSetLogoURL;
			document.getElementById(image.replace("View","")).value = "";
			input.value = "remove";
		}catch(err){console.log(err)}
		return;
	}
	const file = input.files[0];
	const reader = new FileReader();
	reader.onload = () => {
		try{
			document.getElementById(image).src = reader.result;
			document.getElementById(image.replace("View","")+"Clear").value = "";
		}catch(err){console.log(err)}
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
