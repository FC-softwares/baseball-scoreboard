var socket = io("http://"+window.location.hostname+":"+location.port);

socket.emit('getSettings');

socket.on('update', update);
socket.on('updateSettings', updateSettings);
socket.on('connectSettings', connectSettings);
socket.on('connectData', update);
function update(obj){
	// Teams
	// Away
	try{document.querySelector("div.teamName#away > div > span").innerHTML = obj.Teams.Away.Name;}catch(error){console.error(error)}
	document.documentElement.style.setProperty('--c-away', obj.Teams.Away.Color);
	if(brightnessByColor(obj.Teams.Away.Color)<60)
		document.documentElement.style.setProperty('--c-score-away', '#ffffff');
	else
		document.documentElement.style.setProperty('--c-score-away', '#000000');
	if(brightnessByColor(obj.Teams.Away.Color)>190)
		document.querySelector("div.teamName#away > div").classList.add("bg-enabled");
	else
		document.querySelector("div.teamName#away > div").classList.remove("bg-enabled");
	// Home
	try{document.querySelector("div.teamName#home > div > span").innerHTML = obj.Teams.Home.Name;}catch(error){console.error(error)}
	document.documentElement.style.setProperty('--c-home', obj.Teams.Home.Color);
	if(brightnessByColor(obj.Teams.Home.Color)<60)
		document.documentElement.style.setProperty('--c-score-home', '#ffffff');
	else
		document.documentElement.style.setProperty('--c-score-home', '#000000');
	if(brightnessByColor(obj.Teams.Home.Color)>190)
		document.querySelector("div.teamName#home > div").classList.add("bg-enabled");
	else
		document.querySelector("div.teamName#home > div").classList.remove("bg-enabled");
	// Score (for scoreboard, partials, and post-game)
	if(document.URL.includes("postgame.html")){
		try{document.querySelector("div.teamScore#home > span").innerHTML = obj.Teams.Home.Score;}catch(error){console.error(error)}
		try{document.querySelector("div.teamScore#away  > span").innerHTML = obj.Teams.Away.Score;}catch(error){console.error(error)}
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
}

function updateInning(obj) {
	try { document.querySelector(".score > #away").innerHTML = obj.Teams.Away.Score; } catch (error) { console.error(error); }
	try { document.querySelector(".score > #home").innerHTML = obj.Teams.Home.Score; } catch (error) { console.error(error); }

	let extraInningScoreAway = 0, extraInningScoreHome = 0;
	for (let i = 1; i <= localStorage.getItem("MaxInning"); i++) {
		try {
			document.querySelector("#i" + i + " > #away").classList.add("disabled");
			document.querySelector("#i" + i + " > #away").innerHTML = "";
		} catch (error) {
			console.error(error);
		}
		try {
			document.querySelector("#i" + i + " > #home").classList.add("disabled");
			document.querySelector("#i" + i + " > #home").innerHTML = "";
		} catch (error) {
			console.error(error);
		}
	}
	for (let i = 1; i <= obj.Inning; i++) {
		if (i > localStorage.getItem("MaxInning")) {
			extraInningScoreAway += obj.Int[i].A;
			extraInningScoreHome += obj.Int[i].H;
		} else {
			if (i < obj.Inning) {
				try {
					document.querySelector("#i" + i + " > #home").classList.remove("disabled");
					document.querySelector("#i" + i + " > #home").innerHTML = obj.Int[i].H;
				} catch (error) {
					console.error(error);
				}
				try {
					document.querySelector("#i" + i + " > #away").classList.remove("disabled");
					document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
				} catch (error) {
					console.error(error);
				}
			} else {
				if (obj.Arrow == 2) {
					try {
						document.querySelector("#i" + i + " > #away").classList.remove("disabled");
						document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
					} catch (error) {
						console.error(error);
					}
					if (obj.Int[i].H != 0) {
						try {
							document.querySelector("#i" + i + " > #home").classList.remove("disabled");
							document.querySelector("#i" + i + " > #home").innerHTML = obj.Int[i].H;
						} catch (error) {
							console.error(error);
						}
					}
				} else if (obj.Int[i].H != 0) {
					try {
						document.querySelector("#i" + i + " > #away").classList.remove("disabled");
						document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
					} catch (error) {
						console.error(error);
					}
					try {
						document.querySelector("#i" + i + " > #home").classList.remove("disabled");
						document.querySelector("#i" + i + " > #home").innerHTML = obj.Int[i].H;
					} catch (error) {
						console.error(error);
					}
				} else if (obj.Int[i].A != 0) {
					try {
						document.querySelector("#i" + i + " > #away").classList.remove("disabled");
						document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
					} catch (error) {
						console.error(error);
					}
				}
			}
		}
	}
	if (obj.Inning > localStorage.getItem("MaxInning")) {
		if (obj.Inning > parseInt(localStorage.getItem("MaxInning")) + 1 || obj.Arrow == 2 || extraInningScoreAway != 0 || extraInningScoreHome != 0) {
			let inning = getComputedStyle(document.documentElement).getPropertyValue('--i-inning');
			if (inning == localStorage.getItem("MaxInning")) {
				document.documentElement.style.setProperty('--i-inning', inning);
				let extraInning = `<div class="inning" id="iex">
						<span class="number">EX</span>
						<span class="score" id="away">${extraInningScoreAway}</span>
						<span class="score" id="home">${extraInningScoreHome}</span>
					</div>`; // waiting for @TheTecnoKing snippet
				try { document.querySelector("div.container").innerHTML += extraInning; } catch (error) { console.error(error); }
				document.documentElement.style.setProperty('--i-inning', parseInt(localStorage.getItem("MaxInning")) + 1);
			}
			try { document.querySelector("#iex > #away").innerHTML = extraInningScoreAway; } catch (error) { console.error(error); }
			try { document.querySelector("#iex > #home").innerHTML = extraInningScoreHome; } catch (error) { console.error(error); }
		} else {
			if (getComputedStyle(document.documentElement).getPropertyValue('--i-inning') != localStorage.getItem("MaxInning")) {
				document.documentElement.style.setProperty('--i-inning', localStorage.getItem("MaxInning"));
				try { document.querySelector("div.container > #iex.inning").remove(); } catch (error) { console.error(error); }
			}
		}
	} else {
		if (getComputedStyle(document.documentElement).getPropertyValue('--i-inning') != localStorage.getItem("MaxInning")) {
			document.documentElement.style.setProperty('--i-inning', localStorage.getItem("MaxInning"));
			try { document.querySelector("div.container > #iex.inning").remove(); } catch (error) { console.error(error); }
		}
	}
}

function updateScoreboard(obj) {
	try { document.querySelector("div.teamScore#home").innerHTML = obj.Teams.Home.Score; } catch (error) { console.error(error); }
	try { document.querySelector("div.teamScore#away").innerHTML = obj.Teams.Away.Score; } catch (error) { console.error(error); }
	// Ball Strike
	try { document.querySelector("span#ball").innerHTML = obj.Ball; } catch (error) { console.error(error); }
	try { document.querySelector("span#strike").innerHTML = obj.Strike; } catch (error) { console.error(error); }
	// Outs
	try { document.querySelector("span#number").innerHTML = obj.Out; } catch (error) { console.error(error); }
	// Inning and Top/Bottom
	try { document.querySelector(".inning > span#number").innerHTML = obj.Inning; } catch (error) { console.error(error); }
	if (obj.Arrow == 1) {
		try { document.querySelector(".inning > span#up").classList.remove("disabled"); } catch (error) { console.error(error); }
		try { document.querySelector(".inning > span#down").classList.add("disabled"); } catch (error) { console.error(error); }
	} else {
		try { document.querySelector(".inning > span#up").classList.add("disabled"); } catch (error) { console.error(error); }
		try { document.querySelector(".inning > span#down").classList.remove("disabled"); } catch (error) { console.error(error); }
	}
	if (obj.Bases[1]) {
		try { document.querySelector("div#first").classList.remove("disabled"); } catch (error) { console.error(error); }
	} else {
		try { document.querySelector("div#first").classList.add("disabled"); } catch (error) { console.error(error); }
	}
	if (obj.Bases[2]) {
		try { document.querySelector("div#second").classList.remove("disabled"); } catch (error) { console.error(error); }
	} else {
		try { document.querySelector("div#second").classList.add("disabled"); } catch (error) { console.error(error); }
	}
	if (obj.Bases[3]) {
		try { document.querySelector("div#third").classList.remove("disabled"); } catch (error) { console.error(error); }
	} else {
		try { document.querySelector("div#third").classList.add("disabled"); } catch (error) { console.error(error); }
	}
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
/**
 * @param {String} color 
 * @returns Color Brightness from 0 to 255
 */
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