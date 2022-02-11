var socket = io("http://"+window.location.hostname+":"+location.port);

socket.emit('getSettings');

socket.on('update', update);
socket.on('updateSettings', updateSettings);
socket.on('connectSettings', updateSettings);

function update(obj){
	// Teams
	// Away
	try{document.querySelector("div.teamName#away").innerHTML = obj.Teams.Away.Name;}catch(error){console.error(error)}
	document.documentElement.style.setProperty('--c-away', obj.Teams.Away.Color);
	console.log(brightnessByColor(obj.Teams.Away.Color));
	if(brightnessByColor(obj.Teams.Away.Color)<60)
		document.documentElement.style.setProperty('--c-score-away', '#ffffff');
	else
		document.documentElement.style.setProperty('--c-score-away', '#000000');
	// Home
	try{document.querySelector("div.teamName#home").innerHTML = obj.Teams.Home.Name;}catch(error){console.error(error)}
	document.documentElement.style.setProperty('--c-home', obj.Teams.Home.Color);
	console.log(brightnessByColor(obj.Teams.Home.Color));
	if(brightnessByColor(obj.Teams.Home.Color)<60)
		document.documentElement.style.setProperty('--c-score-home', '#ffffff');
	else
		document.documentElement.style.setProperty('--c-score-home', '#000000');
	
	// Score (for scoreboard, partials, and post-game)
	if(document.URL.includes("scoreboard.html")||document.URL.includes("partials.html")||document.URL.includes("postgame.html")){
		try{document.querySelector("div.teamScore#home").innerHTML = obj.Teams.Home.Score;}catch(error){console.error(error)}
		try{document.querySelector("div.teamScore#away").innerHTML = obj.Teams.Away.Score;}catch(error){console.error(error)}
	}
	// Only for scoreboard
	if (document.URL.includes("scoreboard.html")) {
		// Ball Strike
		try{document.querySelector("span#ball").innerHTML = obj.Ball;}catch(error){console.error(error)}
		try{document.querySelector("span#strike").innerHTML = obj.Strike;}catch(error){console.error(error)}
		// Outs
		try{document.querySelector("span#number").innerHTML = obj.Out;}catch(error){console.error(error)}
		// Inning and Top/Bottom
		try{document.querySelector(".inning > span#number").innerHTML = obj.Inning;}catch(error){console.error(error)}
		if(obj.Arrow == 1){
			try{document.querySelector(".inning > span#up").classList.remove("disabled");}catch(error){console.error(error)}
			try{document.querySelector(".inning > span#down").classList.add("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector(".inning > span#up").classList.add("disabled");}catch(error){console.error(error)}
			try{document.querySelector(".inning > span#down").classList.remove("disabled");}catch(error){console.error(error)}
		}
		if(obj.Bases[1]){
			try{document.querySelector("div#first").classList.remove("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector("div#first").classList.add("disabled");}catch(error){console.error(error)}
		}
		if(obj.Bases[2]){
			try{document.querySelector("div#second").classList.remove("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector("div#second").classList.add("disabled");}catch(error){console.error(error)}
		}
		if(obj.Bases[3]){
			try{document.querySelector("div#third").classList.remove("disabled");}catch(error){console.error(error)}
		}else{
			try{document.querySelector("div#third").classList.add("disabled");}catch(error){console.error(error)}
		}
	}
	// Only for partials
	// This code is now commented because it have to be tested after @TheTecnoKing will have finished to write the HTML page "inning.html"
	if (document.URL.includes("inning.html")) {
		let extraInningScoreAway = 0,extraInningScoreHome = 0;
		for (let i = 1; i <= localStorage.getItem("MaxInning"); i++) {
			try{
				document.querySelector("#i"+i+" > #away").classList.add("disabled");
				document.querySelector("#i"+i+" > #away").innerHTML = "";
			}catch(error){
				console.error(error);
			}
			try{
				document.querySelector("#i"+i+" > #home").classList.add("disabled");
				document.querySelector("#i"+i+" > #home").innerHTML = "";
			}catch(error){
				console.error(error);
			}			
		}
		for(let i = 1; i <= obj.Inning; i++){
			if(i>localStorage.getItem("MaxInning")){
				extraInningScoreAway += obj.Int[i].A;
				extraInningScoreHome += obj.Int[i].H;
			}else{
				if(i<obj.Inning){
					try{
						document.querySelector("#i"+i+" > #home").classList.remove("disabled");
						document.querySelector("#i"+i+" > #home").innerHTML = obj.Int[i].H;
					}catch(error){
						console.error(error);
					}
					try{
						document.querySelector("#i"+i+" > #away").classList.remove("disabled");
						document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
					}catch(error){
						console.error(error);
					}
				}else{
					if(obj.Arrow==2){
						try {
							document.querySelector("#i"+i+" > #away").classList.remove("disabled");
							document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
						} catch (error) {
							console.error(error);
						}
					}else if(obj.Int[i].H!=0){
						try {
							document.querySelector("#i"+i+" > #away").classList.remove("disabled");
							document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
						} catch (error) {
							console.error(error);
						}
						try {
							document.querySelector("#i"+i+" > #home").classList.remove("disabled");
							document.querySelector("#i"+i+" > #home").innerHTML = obj.Int[i].H;
						} catch (error) {
							console.error(error);
						}
					}else if(obj.Int[i].A!=0){
						try {
							document.querySelector("#i"+i+" > #away").classList.add("disabled");
							document.querySelector("#i"+i+" > #away").innerHTML = obj.Int[i].A;
						} catch (error) {
							console.error(error);
						}
					}
				}
			}
		}
		if(obj.Inning>localStorage.getItem("MaxInning")){
			//add the extra inning div to the scoreboard
			let extraInning=``; // waiting for @TheTecnoKing snippet
			try{document.querySelector("div.inningContainer").innerHTML += extraInning;}catch(error){console.error(error);}
		}
	}
}

function updateSettings(json){
	// Settings
	const obj = JSON.parse(json);
	const oldMaxInning = localStorage.getItem("MaxInning");
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
	// update the container of the innings
	if(document.URL.includes("inning.html")){
		if(obj.MaxInning>oldMaxInning){
			// TODO add remaining innings
			for(let i=oldMaxInning+1;i<=obj.MaxInning;i++){
				let inning = ``; //waiting for @TheTecnoKing snippet
				try{document.querySelector("div.inningContainer").innerHTML += inning;}catch(error){console.error(error);}
			}
		}else if(obj.MaxInning<oldMaxInning){
			// TODO remove excess innings
			for(let i=obj.MaxInning+1;i<=oldMaxInning;i++){
				try{document.querySelector("div.inningContainer").removeChild(document.querySelector("div.inningContainer").lastChild);}catch(error){console.error(error);}
			}
		}
	}
}

function connectSettings(json) {
	// Settings
	const obj = JSON.parse(json);
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
	// Set the container with the innings 
	let container=``; //waiting for @TheTecnoKing snippet
	for(let i=0;i<obj.MaxInning;i++)
		container+=``; //waiting for @TheTecnoKing snippet
	document.querySelector("div.inningContainer").innerHTML = container;
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