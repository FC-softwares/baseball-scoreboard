var socket = io("http://"+window.location.hostname+":"+location.port);

socket.emit('getSettings');
socket.emit('getActive');

socket.on('update', update);
socket.on('updateSettings', updateSettings);
socket.on('connectSettings', connectSettings);
socket.on('connectData', update);
socket.on('updateActive', updateActive);
socket.on('connectActive', updateActive);

function update(obj) {
	if(obj?.Teams?.Home)
		updateTeams(obj.Teams.Home,"home");
	if(obj?.Teams?.Away)
		updateTeams(obj.Teams.Away,"away");
	// Score (for postgame)
	if(document.URL.includes("postgame.html")){
		updateTeamScorePostgame(obj.Teams.Home.Score,"home");
		updateTeamScorePostgame(obj.Teams.Away.Score,"away");
	}
	// Only for scoreboard
	if (document.URL.includes("scoreboard.html")) {
		updateScoreboard(obj);
	}
	// Only for partials
	if (document.URL.includes("inning.html")) {
		// Total score
		updateInning(obj);
	}
	updateLogo(obj?.Teams?.Home?.Logo,".teamLogo#home>img");
	updateLogo(obj?.Teams?.Away?.Logo,".teamLogo#away>img");
}

function updateTeamScorePostgame(data, team) {
	if (data !== undefined)
		try { document.querySelector("div.teamScore#"+team+" > span").innerHTML = data; } catch (error) { console.error(error); }
}

function updateTeams(data,team) {
	if (data?.Name !== undefined)
		try { document.querySelector("div.teamName#" + team + " > div > span").innerHTML = data.Name; } catch (error) { console.error(error); }
	if (data?.Color !== undefined) {
		document.documentElement.style.setProperty('--c-' + team, data.Color);
		if (brightnessByColor(data.Color) < 60)
			document.documentElement.style.setProperty('--c-score-' + team, '#ffffff');
		else
			document.documentElement.style.setProperty('--c-score-' + team, '#000000');
		try {
			if (brightnessByColor(data.Color) > 190)
				document.querySelector("div.teamName#" + team + " > div#bg").classList.add("bg-dark");
			else
				document.querySelector("div.teamName#" + team + " > div#bg").classList.remove("bg-dark");
		} catch (error) { console.error(error); }
	}
}

function updateInning(obj) {
	let { extraInningScoreAway, extraInningScoreHome } = updateGeneralInning(obj);
	for (let i = 1; i <= obj.Inning; i++) {
		if (i > localStorage.getItem("MaxInning")) {
			extraInningScoreAway += obj.Int[i].A;
			extraInningScoreHome += obj.Int[i].H;
		} else {
			if (i < obj.Inning || obj.Int[i].H != 0){
				activeDeactiveInning(i, 'home',true,obj.Int[i].H);
				activeDeactiveInning(i, 'away',true,obj.Int[i].A);
			} else if (obj.Arrow == 2) {
				activeDeactiveInning(i, 'away',true,obj.Int[i].A);
				if (obj.Int[i].H != 0)
					activeDeactiveInning(i, 'home',true,obj.Int[i].H);
			} else if (obj.Int[i].A != 0) {
				activeDeactiveInning(i, 'away',true,obj.Int[i].A);
			}
		}
	}
	maxInning(obj, extraInningScoreAway, extraInningScoreHome);
}

function updateGeneralInning(obj) {
	updateGeneralSccoreInning(obj?.Teams?.Home?.Score,"home");
	updateGeneralSccoreInning(obj?.Teams?.Away?.Score,"away");

	let extraInningScoreAway = 0, extraInningScoreHome = 0;
	for (let i = 1; i <= localStorage.getItem("MaxInning"); i++) {
		activeDeactiveInning(i, 'home',false,0);
		activeDeactiveInning(i, 'away',false,0);
	}
	return { extraInningScoreAway, extraInningScoreHome };
}

function updateGeneralSccoreInning(Score,id) {
	if (Score !== undefined)
		try { document.querySelector(".score > #"+id).innerHTML = Score; } catch (error) { console.error(error); }
}

function activeDeactiveInning(i,team,active,score){
	if(active){
		try{
			document.querySelector("#i" + i + " > #"+team).classList.remove("disabledinng");
			document.querySelector("#i" + i + " > #"+team).innerHTML = score;
		}catch(error){
			console.error(error);
		}
	}else{
		try{
		document.querySelector("#i" + i + " > #"+team).classList.add("disabledinng");
		document.querySelector("#i" + i + " > #"+team).innerHTML = "";
		}catch(error){
			console.error(error);
		}
	}
}

function maxInning(obj, extraInningScoreAway, extraInningScoreHome) {
	if( obj.Inning <= parseInt(localStorage.getItem("MaxInning"))){
		document.documentElement.style.setProperty('--i-inning', localStorage.getItem("MaxInning"));
		try{document.querySelector("div.container > div#iex").remove();}catch(error){console.log(error);}
	}else if (obj.Inning > parseInt(localStorage.getItem("MaxInning")) + 1 || (obj.Arrow == 2&&obj.Inning == parseInt(localStorage.getItem("MaxInning")+1)) || extraInningScoreAway != 0 || extraInningScoreHome != 0) {
		let inning = getComputedStyle(document.documentElement).getPropertyValue('--i-inning');
		if (inning == parseInt(localStorage.getItem("MaxInning"))) {
			document.documentElement.style.setProperty('--i-inning', inning);
			let extraInning = `<div class="inning" id="iex">
					<span class="number">EX</span>
					<span class="score" id="away">${extraInningScoreAway}</span>
					<span class="score" id="home">${extraInningScoreHome}</span>
				</div>`;
			try { document.querySelector("div.container").innerHTML += extraInning; } catch (error) { console.error(error); }
			document.documentElement.style.setProperty('--i-inning', parseInt(localStorage.getItem("MaxInning")) + 1);
		}
		try { document.querySelector("#iex > #away").innerHTML = extraInningScoreAway; } catch (error) { console.error(error); }
		try { document.querySelector("#iex > #home").innerHTML = extraInningScoreHome; } catch (error) { console.error(error); }
	} else if (getComputedStyle(document.documentElement).getPropertyValue('--i-inning') != localStorage.getItem("MaxInning")) {
		document.documentElement.style.setProperty('--i-inning', localStorage.getItem("MaxInning"));
		try { document.querySelector("div.container > #iex.inning").remove(); } catch (error) { console.error(error); }
	}
}

function updateScoreboard(obj) {
	try { document.querySelector("div.teamScore#home").innerHTML = obj.Teams.Home.Score; } catch (error) { console.error(error); }
	try { document.querySelector("div.teamScore#away").innerHTML = obj.Teams.Away.Score; } catch (error) { console.error(error); }
	// Ball Strike
	updateNumber(obj?.Ball, "ball");
	updateNumber(obj?.Strike, "strike");
	updateNumber(obj?.Out, "number");
	// Inning and Top/Bottom
	try { document.querySelector(".inning > span#number").innerHTML = obj.Inning; } catch (error) { console.error(error); }
	if(obj?.Arrow !== undefined){
		if (obj.Arrow == 1) {
			try { document.querySelector(".inning > span#up").classList.remove("disabled"); } catch (error) { console.error(error); }
			try { document.querySelector(".inning > span#down").classList.add("disabled"); } catch (error) { console.error(error); }
		} else {
			try { document.querySelector(".inning > span#up").classList.add("disabled"); } catch (error) { console.error(error); }
			try { document.querySelector(".inning > span#down").classList.remove("disabled"); } catch (error) { console.error(error); }
		}
	}
	try{updateBase(obj?.Bases[1], "first")}catch(error){console.error(error);}
	try{updateBase(obj?.Bases[2], "second")}catch(error){console.error(error);}
	try{updateBase(obj?.Bases[3], "third");}catch(error){console.error(error);}

}
function updateLogo(logo, id) {
	try {
		if (logo !== undefined)
			document.querySelector(id).src = logo.replaceAll(/[\n'"]/g,'')
		else if (logo !== undefined && logo == "")
			document.querySelector(id).src = "img/baseball-ball.png";
	} catch (error) { console.error(error); }
}

function updateBase(base,id) {
	if (base !== undefined) {
		if (base) {
			try { document.querySelector("div#"+id).classList.remove("disabled"); } catch (error) { console.error(error); }
		} else {
			try { document.querySelector("div#"+id).classList.add("disabled"); } catch (error) { console.error(error); }
		}
	}
}

function updateNumber(data, id) {
	if(data !== undefined)
		try { document.querySelector("span#" + id).innerHTML = data; } catch (error) { console.error(error); }
}

function updateSettings(obj){
	// Settings
	const oldMaxInning = parseInt(localStorage.getItem("MaxInning"));
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
	document.documentElement.style.setProperty('--i-inning', obj.MaxInning);
	// update the container of the innings
	if(document.URL.includes("inning.html")){
		if(obj.MaxInning>oldMaxInning){
			for(let i=oldMaxInning+1;i<=obj.MaxInning;i++){
				let inning = `<div class="inning" id="i${i}">
				<span class="number">${i}</span>
				<span class="score disabled" id="away">0</span>
				<span class="score disabled" id="home">0</span>
			</div>`;
				try{document.querySelector("div.container").innerHTML += inning;}catch(error){console.error(error);}
			}
		}else if(obj.MaxInning<oldMaxInning){
			// TODO remove excess innings
			for(let i=obj.MaxInning+1;i<=oldMaxInning;i++){
				try{document.querySelector("div.container").removeChild(document.querySelector(`#i${i}.inning`));}catch(error){console.error(error);}
			}
		}
	}
}

function connectSettings(obj) {
	// Settings
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
	// Set the container with the innings
	if(document.URL.includes("inning.html")){
		document.documentElement.style.setProperty("--i-inning",obj.MaxInning);
		let container = ``;
		for(let i=1;i<=obj.MaxInning;i++)
			if(i<=obj.Data.Inning)
				container+=`<div class="inning" id="i${i}">
					<span class="number">${i}</span>
					<span class="score" id="away">${obj.Data.Int[i].A}</span>
					<span class="score" id="home">${obj.Data.Int[i].H}</span>
				</div>`;
			else
				container+=`<div class="inning" id="i${i}">
					<span class="number">${i}</span>
					<span class="score" id="away">0</span>
					<span class="score" id="home">0</span>
				</div>`;
		document.querySelector("div.container").innerHTML = container;
	}
	socket.emit("getData");
}
function updateActive(json){
	const obj = JSON.parse(json);
	activeDeactiveScoreboard(obj?.main, 'scoreboard.html');
	activeDeactiveScoreboard(obj?.pre, 'pregame.html');
	activeDeactiveScoreboard(obj?.post, 'postgame.html');
	activeDeactiveScoreboard(obj?.inning, 'inning.html');
}
function activeDeactiveScoreboard(data,url){
	if (data !== undefined && document.URL.includes(url)) {
		if (data) {
			document.querySelector("div.scoreboard").classList.remove("disabled");
		} else {
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
}

function brightnessByColor (color) {
	var color = "" + color, isHEX = color.indexOf("#") == 0, isRGB = color.indexOf("rgb") == 0;
	if (isHEX) {
		const hasFullSpec = color.length == 7;
		var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
		if (m) var r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16), g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16), b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
	}
	if (isRGB) {
		var m = color.match(/(\d+){3}/g);
		if (m) var r = m[0], g = m[1], b = m[2];
	}
	if (typeof r != "undefined") return ((r*299)+(g*587)+(b*114))/1000;
}