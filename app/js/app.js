var socket = io("http://"+window.location.hostname+":"+location.port);

socket.emit('getSettings');

socket.on('update', update);
socket.on('updateSettings', updateSettings);
socket.on('connectSettings', updateSettings);

function update(obj){
	const darkenColorAway = lightenDarkenColor(obj.Teams.Away.Color,-75);
	const darkenColorHome = lightenDarkenColor(obj.Teams.Home.Color,-75);
	// Teams
	// Away
	try{document.querySelector("div.teamName#away").innerHTML = obj.Teams.Away.Name;}catch(error){}
	try{document.querySelector("div.teamName#away").style.background = `radial-gradient(${darkenColorAway} 25%,${obj.Teams.Away.Color} 100%)`;}catch(error){}
	try{document.querySelector("div.teamColor#away").style.background = obj.Teams.Away.Color;}catch(error){}
	// Home
	try{document.querySelector("div.teamName#home").innerHTML = obj.Teams.Home.Name;}catch(error){}
	try{document.querySelector("div.teamName#home").style.background = `radial-gradient(${darkenColorHome} 25%, ${obj.Teams.Home.Color} 100%)`;}catch(error){}
	try{document.querySelector("div.teamColor#home").style.background = obj.Teams.Home.Color;}catch(error){}
	
	// Score (for scoreboard, partials, and post-game)
	if(document.URL.includes("scoreboard.html")||document.URL.includes("partials.html")||document.URL.includes("postgame.html")){
		try{document.querySelector("div.teamScore#home").innerHTML = obj.Teams.Home.Score;}catch(error){}
		try{document.querySelector("div.teamScore#away").innerHTML = obj.Teams.Away.Score;}catch(error){}
	}
	// Only for scoreboard
	if (document.URL.includes("scoreboard.html")) {
		// Ball Strike
		try{document.querySelector("div.ball").innerHTML = obj.Ball;}catch(error){}
		try{document.querySelector("span#strike").innerHTML = obj.Strike;}catch(error){}
		// Outs
		try{document.querySelector("span#outs").innerHTML = obj.Out;}catch(error){}
		// Inning and Top/Bottom
		try{document.querySelector("span#inning").innerHTML = obj.Inning;}catch(error){}	
	}
	// Only for partials
	if (document.URL.includes("partials.html")) {
		let extraInningScoreAway = 0,extraInningScoreHome = 0;
		for (let i = 1; i <= localStoeage.getItem("MaxInning"); i++) {
			try{
				document.querySelector("div.inningScore#away"+i).classList.remove("active");
				document.querySelector("div.inningScore#away"+i).innerHTML = "";
			}catch(error){}
			try{
				document.querySelector("div.inningScore#home"+i).classList.remove("active");
				document.querySelector("div.inningScore#home"+i).innerHTML = "";
			}catch(error){}			
		}
		for(let i = 1; i <= obj.Inning; i++){
			if(i>localStorage.getItem("MaxInning")){
				extraInningScoreAway += obj.Int[i].A;
				extraInningScoreHome += obj.Int[i].H;
			}else{
				if(i<obj.Inning){
					try{
						document.querySelector("div.inningScore#home"+i).classList.add("active");
						document.querySelector("div.inningScore#home"+i).innerHTML = obj.Int[i].H;
					}catch(error){}
					try{
						document.querySelector("div.inningScore#away"+i).classList.add("active");
						document.querySelector("div.inningScore#away"+i).innerHTML = obj.Int[i].A;
					}catch(error){}
				}else{
					if(obj.Arrow==2){
						try {
							document.querySelector("div.inningScore#away"+i).classList.add("active");
							document.querySelector("div.inningScore#away"+i).innerHTML = obj.Int[i].A;
						} catch (error) {}
					}else if(obj.Int[i].H!=0){
						try {
							document.querySelector("div.inningScore#away"+i).classList.add("active");
							document.querySelector("div.inningScore#away"+i).innerHTML = obj.Int[i].A;
						} catch (error) {}
						try {
							document.querySelector("div.inningScore#home"+i).classList.add("active");
							document.querySelector("div.inningScore#home"+i).innerHTML = obj.Int[i].H;
						} catch (error) {}
					}else if(obj.Int[i].A!=0){
						try {
							document.querySelector("div.inningScore#away"+i).classList.add("active");
							document.querySelector("div.inningScore#away"+i).innerHTML = obj.Int[i].A;
						} catch (error) {}
					}
				}
			}
		}
		if(obj.Inning>localStorage.getItem("MaxInning")){
			//add the extra inning div to the scoreboard
			
		}
	}
}

function updateSettings(json){
	// Settings
	const obj = JSON.parse(json);
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);
}
/**
 * 
 * @param {String} col input color
 * @param {int} amt amount to lighten or darken from -255 to 255
 * @returns {String} Hex color with at least 6 digits
 */
function lightenDarkenColor(col, amt) {
	var usePound = false;
	if (col[0] == "#") {
		col = col.slice(1);
		usePound = true;
	}
	var num = parseInt(col, 16);
	var r = (num >> 16) + amt;
	if (r > 255) r = 255;
	else if (r < 0) r = 0;
	var b = ((num >> 8) & 0x00FF) + amt;
	if (b > 255) b = 255;
	else if (b < 0) b = 0;
	var g = (num & 0x0000FF) + amt;
	if (g > 255) g = 255;
	else if (g < 0) g = 0;
	//check if the result is a valid hex color
	var result = "#" + (g | (b << 8) | (r << 16)).toString(16);
	if (result.length == 7) {
		return result;
	} else {
		return "#000000";
	}
}