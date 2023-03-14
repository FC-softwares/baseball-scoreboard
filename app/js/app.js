var socket = io("http://"+window.location.hostname+":"+location.port);

const scoreboard = [
	"pregame.html",
	"scoreboard.html",
	"postgame.html",
	"inning.html"
]
const officials = [
	"umpires.html",
	"scorers.html",
	"commentator.html",
	"technicalComment.html"
]
socket.emit('getSettings');
socket.emit('getActive');

socket.on('update', update);
socket.on('updateSettings', updateSettings);
socket.on('connectSettings', connectSettings);
socket.on('connectData', update);
socket.on('updateActive', updateActive);
socket.on('connectActive', connectActive);
socket.on('connectOffices', updateOffices);
socket.on('updateOffices', updateOffices);

function update(obj){
	// Teams
	// Away
	if(obj?.Teams?.Away?.Name !== undefined)
		try{document.querySelector("div.teamName#away > div > span").innerHTML = obj.Teams.Away.Name;}catch(error){console.error(error)}
	if(obj?.Teams?.Away?.Color !== undefined){
		document.documentElement.style.setProperty('--c-away', obj.Teams.Away.Color);
		if(brightnessByColor(obj.Teams.Away.Color)<60)
			document.documentElement.style.setProperty('--c-score-away', '#ffffff');
		else
			document.documentElement.style.setProperty('--c-score-away', '#000000');
		try{
		if(brightnessByColor(obj.Teams.Away.Color)>190)
			document.querySelector("div.teamName#away > div#bg").classList.add("bg-dark");
		else
			document.querySelector("div.teamName#away > div#bg").classList.remove("bg-dark");
		}catch(error){console.error(error)}
	}
	// Home
	if(obj?.Teams?.Home?.Name !== undefined)
		try{document.querySelector("div.teamName#home > div > span").innerHTML = obj.Teams.Home.Name;}catch(error){console.error(error)}
	if(obj?.Teams?.Home?.Color !== undefined){
		document.documentElement.style.setProperty('--c-home', obj.Teams.Home.Color);
		if(brightnessByColor(obj.Teams.Home.Color)<60)
			document.documentElement.style.setProperty('--c-score-home', '#ffffff');
		else
			document.documentElement.style.setProperty('--c-score-home', '#000000');
		try{
		if(brightnessByColor(obj.Teams.Home.Color)>190)
			document.querySelector("div.teamName#home > div#bg").classList.add("bg-dark");
		else
			document.querySelector("div.teamName#home > div#bg").classList.remove("bg-dark");
		}catch(error){console.error(error)}
	}
	// Score (for postgame)
	if(document.URL.includes("postgame.html")){
		if(obj?.Teams?.Home?.Score !== undefined)
			try{document.querySelector("div.teamScore#home > span").innerHTML = obj.Teams.Home.Score;}catch(error){console.error(error)}
		if(obj?.Teams?.Away?.Score !== undefined)
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
	if (obj?.Teams?.Away?.Score !== undefined)
		try { document.querySelector(".score > #away").innerHTML = obj.Teams.Away.Score; } catch (error) { console.error(error); }
	if (obj?.Teams?.Home?.Score !== undefined)
		try { document.querySelector(".score > #home").innerHTML = obj.Teams.Home.Score; } catch (error) { console.error(error); }

	let extraInningScoreAway = 0, extraInningScoreHome = 0;
	for (let i = 1; i <= localStorage.getItem("MaxInning"); i++) {
		try {
			document.querySelector("#i" + i + " > #away").classList.add("disabledinng");
			document.querySelector("#i" + i + " > #away").innerHTML = "";
		} catch (error) {
			console.error(error);
		}
		try {
			document.querySelector("#i" + i + " > #home").classList.add("disabledinng");
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
					document.querySelector("#i" + i + " > #home").classList.remove("disabledinng");
					document.querySelector("#i" + i + " > #home").innerHTML = obj.Int[i].H;
				} catch (error) {
					console.error(error);
				}
				try {
					document.querySelector("#i" + i + " > #away").classList.remove("disabledinng");
					document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
				} catch (error) {
					console.error(error);
				}
			} else {
				if (obj.Arrow == 2) {
					try {
						document.querySelector("#i" + i + " > #away").classList.remove("disabledinng");
						document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
					} catch (error) {
						console.error(error);
					}
					if (obj.Int[i].H != 0) {
						try {
							document.querySelector("#i" + i + " > #home").classList.remove("disabledinng");
							document.querySelector("#i" + i + " > #home").innerHTML = obj.Int[i].H;
						} catch (error) {
							console.error(error);
						}
					}
				} else if (obj.Int[i].H != 0) {
					try {
						document.querySelector("#i" + i + " > #away").classList.remove("disabledinng");
						document.querySelector("#i" + i + " > #away").innerHTML = obj.Int[i].A;
					} catch (error) {
						console.error(error);
					}
					try {
						document.querySelector("#i" + i + " > #home").classList.remove("disabledinng");
						document.querySelector("#i" + i + " > #home").innerHTML = obj.Int[i].H;
					} catch (error) {
						console.error(error);
					}
				} else if (obj.Int[i].A != 0) {
					try {
						document.querySelector("#i" + i + " > #away").classList.remove("disabledinng");
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
	if(obj?.Ball !== undefined)
		try { document.querySelector("span#ball").innerHTML = obj.Ball; } catch (error) { console.error(error); }
	if(obj?.Strike !== undefined)
		try { document.querySelector("span#strike").innerHTML = obj.Strike; } catch (error) { console.error(error); }
	// Outs
	if(obj?.Out !== undefined)
		try { document.querySelector("span#number").innerHTML = obj.Out; } catch (error) { console.error(error); }
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
	if(obj?.Bases[1] !== undefined){
		if (obj.Bases[1]) {
			try { document.querySelector("div#first").classList.remove("disabled"); } catch (error) { console.error(error); }
		} else {
			try { document.querySelector("div#first").classList.add("disabled"); } catch (error) { console.error(error); }
		}
	}
	if(obj?.Bases[2] !== undefined){
		if (obj.Bases[2]) {
			try { document.querySelector("div#second").classList.remove("disabled"); } catch (error) { console.error(error); }
		} else {
			try { document.querySelector("div#second").classList.add("disabled"); } catch (error) { console.error(error); }
		}
	}
	if(obj?.Bases[3] !== undefined){
		if (obj.Bases[3]) {
			try { document.querySelector("div#third").classList.remove("disabled"); } catch (error) { console.error(error); }
		} else {
			try { document.querySelector("div#third").classList.add("disabled"); } catch (error) { console.error(error); }
		}
	}
}

function updateSettings(obj){
	// Settings
	const oldMaxInning = parseInt(localStorage.getItem("MaxInning"));
	localStorage.setItem("MaxInning",obj.MaxInning);
	localStorage.setItem("BlackenLastInning",obj.BlackenLastInning);

	document.documentElement.style.setProperty('--h-scale', obj.Resolution+"px");
	document.documentElement.style.setProperty('--w-scale', obj.Resolution*1.78+"px");

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
	document.documentElement.style.setProperty('--h-scale', obj.Resolution+"px");
	document.documentElement.style.setProperty('--w-scale', obj.Resolution*1.78+"px");
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
	if(scoreboard.includes(document.URL.split("/").pop()))
		socket.emit("getData");
	else if (officials.includes(document.URL.split("/").pop()))
		socket.emit("getOffices");
}
// TODO: make this function WORK with the help of @TheTecnoKing
function updateActive(json){
	const obj = JSON.parse(json);
	if(obj.main!==undefined && document.URL.includes("scoreboard.html")){
		if(obj.main){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.pre!==undefined && document.URL.includes("pregame.html")){
		if(obj.pre){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.post!==undefined && document.URL.includes("postgame.html")){
		if(obj.post){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.inning!==undefined && document.URL.includes("inning.html")){
		if(obj.inning){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.umpires!==undefined && document.URL.includes("umpires.html")){
		if(obj.umpires){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.scorers!==undefined && document.URL.includes("scorers.html")){
		if(obj.scorers){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.commentator!==undefined && document.URL.includes("commentator.html")){
		if(obj.commentator){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(obj.technicalComment!==undefined && document.URL.includes("technicalComment.html")){
		if(obj.technicalComment){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
}

function connectActive(json){
	const obj = JSON.parse(json);
	if(document.URL.includes("scoreboard.html")){
		if(obj.main){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("pregame.html")){
		if(obj.pre){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("postgame.html")){
		if(obj.post){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("inning.html")){
		if(obj.inning){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("umpires.html")){
		if(obj.umpires){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("scorers.html")){
		if(obj.scorers){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("commentator.html")){
		if(obj.commentator){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
	if(document.URL.includes("technicalComment.html")){
		if(obj.technicalComment){
			document.querySelector("div.scoreboard").classList.remove("disabled");
		}else{
			document.querySelector("div.scoreboard").classList.add("disabled");
		}
	}
}

function updateOffices(obj){
	if(document.URL.includes("umpires.html")){
		updateUmpires(obj.umpires);
	}else if(document.URL.includes("scorers.html")){
		updateScorer(obj.scorers);
	}else if(document.URL.includes("commentator.html")){
		updateCommentators(obj.commentators);
	}else if (document.URL.includes("technicalComment.html")){
		updateTechnicalComment(obj.commentators);
	}
}
function updateUmpires(obj){
	const HP = obj?.HP;
	const B1 = obj?.B1;
	const B2 = obj?.B2;
	const B3 = obj?.B3;
	if(HP !== undefined){
		HP.surname || HP.surname=="" ? document.querySelector(".name#home > span#surname").innerHTML = HP.surname : null;
		HP.name || HP.name=="" ? document.querySelector(".name#home > span#name").innerHTML = HP.name : null;
		if(HP.active){
			document.querySelector(".name#home").classList.remove("notActive");
			document.querySelector(".role#home").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-hp", "var(--h-row)");
			document.documentElement.style.setProperty("--d-HB", "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-HB", "var(--d-standard)");
		}else if (HP?.active === false){
			document.documentElement.style.setProperty("--h-row-hp", "0");
			document.querySelector(".name#home").classList.add("notActive");
			document.querySelector(".role#home").classList.add("notActive");
			document.documentElement.style.setProperty("--d-HB", "0s");
			document.documentElement.style.setProperty("--d-d-HB", "0s");
		}
	}
	if(B1 !== undefined){
		B1.surname || B1.surname=="" ? document.querySelector(".name#B1 > span#surname").innerHTML = B1.surname : null;
		B1.name || B1.name=="" ? document.querySelector(".name#B1 > span#name").innerHTML = B1.name : null;
		if(B1.active){
			document.querySelector(".name#B1").classList.remove("notActive");
			document.querySelector(".role#B1").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-1B", "var(--h-row)");
			document.documentElement.style.setProperty("--d-1B", "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-1B", "var(--d-standard)");
		}else if (B1?.active === false){
			document.documentElement.style.setProperty("--h-row-1B", "0");
			document.querySelector(".name#B1").classList.add("notActive");
			document.querySelector(".role#B1").classList.add("notActive");
			document.documentElement.style.setProperty("--d-1B", "0s");
			document.documentElement.style.setProperty("--d-d-1B", "0s");
		}
	}
	if(B2 !== undefined){
		B2.surname || B2.surname=="" ? document.querySelector(".name#B2 > span#surname").innerHTML = B2.surname : null;
		B2.name || B2.name=="" ? document.querySelector(".name#B2 > span#name").innerHTML = B2.name : null;
		if(B2.active){
			document.querySelector(".name#B2").classList.remove("notActive");
			document.querySelector(".role#B2").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-2B", "var(--h-row)");
			document.documentElement.style.setProperty("--d-2B", "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-2B", "var(--d-standard)");
		}else if (B2?.active === false){
			document.documentElement.style.setProperty("--h-row-2B", "0");
			document.querySelector(".name#B2").classList.add("notActive");
			document.querySelector(".role#B2").classList.add("notActive");
			document.documentElement.style.setProperty("--d-2B", "0s");
			document.documentElement.style.setProperty("--d-d-2B", "0s");
		}
	}
	if(B3 !== undefined){
		B3.surname || B3.surname=="" ? document.querySelector(".name#B3 > span#surname").innerHTML = B3.surname : null;
		B3.name || B3.name==""? document.querySelector(".name#B3 > span#name").innerHTML = B3.name : null;
		if(B3.active){
			document.querySelector(".name#B3").classList.remove("notActive");
			document.querySelector(".role#B3").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-3B", "var(--h-row)");
			document.documentElement.style.setProperty("--d-3B", "var(--d-standard)");
		}else if (B3?.active === false){
			document.querySelector(".name#B3").classList.add("notActive");
			document.querySelector(".role#B3").classList.add("notActive");
			document.documentElement.style.setProperty("--h-row-3B", "0");
			document.documentElement.style.setProperty("--d-3B", "0s");
			document.documentElement.style.setProperty("--d-d-3B", "0s");
		}
	}
	document.querySelectorAll(".scoreboard > div").forEach((e) => {
		e.classList.remove("last");
	});
	if(document.documentElement.style.getPropertyValue('--h-row-3B') != "0"){
		document.querySelectorAll("#B3").forEach((e) => {
			e.classList.add("last")
		});
	}else if(document.documentElement.style.getPropertyValue('--h-row-2B') != "0"){
		document.querySelectorAll("#B2").forEach((e) => {
			e.classList.add("last")
		});
	}else if(document.documentElement.style.getPropertyValue('--h-row-1B') != "0"){
		document.querySelectorAll("#B1").forEach((e) => {
			e.classList.add("last")
		});
	}else if(document.documentElement.style.getPropertyValue('--h-row-hp') != "0"){
		document.querySelectorAll("#home").forEach((e) => {
			e.classList.add("last")
		});
	}
}
function updateScorer(obj){
	const head = obj?.head;
	const second = obj?.second;
	const third = obj?.third;
	console.log(obj);
	if(head !== undefined){
		head.surname || head.surname=="" ? document.querySelector(".scorer#head > span#surname").innerHTML = head.surname : null;
		head.name || head.name=="" ? document.querySelector(".scorer#head > span#name").innerHTML = head.name : null;
		if(head.active){
			document.querySelector(".scorer#head").classList.remove("notActive");
			document.querySelector(".scorer#head").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-head", "var(--h-row)");
			document.documentElement.style.setProperty("--d-head", "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-head", "var(--d-standard)");
		}else if (head?.active === false){
			document.documentElement.style.setProperty("--h-row-head", "0");
			document.querySelector(".scorer#head").classList.add("notActive");
			document.querySelector(".scorer#head").classList.add("notActive");
			document.documentElement.style.setProperty("--d-head", "0s");
			document.documentElement.style.setProperty("--d-d-head", "0s");
		}
	}
	if(second !== undefined){
		second.surname || second.surname=="" ? document.querySelector(".scorer#second > span#surname").innerHTML = second.surname : null;
		second.name || second.name=="" ? document.querySelector(".scorer#second > span#name").innerHTML = second.name : null;
		if(second.active){
			document.querySelector(".scorer#second").classList.remove("notActive");
			document.querySelector(".scorer#second").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-second", "var(--h-row)");
			document.documentElement.style.setProperty("--d-second", "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-second", "var(--d-standard)");
		}else if (second?.active === false){
			document.documentElement.style.setProperty("--h-row-second", "0");
			document.querySelector(".scorer#second").classList.add("notActive");
			document.querySelector(".scorer#second").classList.add("notActive");
			document.documentElement.style.setProperty("--d-second", "0s");
			document.documentElement.style.setProperty("--d-d-second", "0s");
		}
	}
	if(third !== undefined){
		third.surname || third.surname=="" ? document.querySelector(".scorer#third > span#surname").innerHTML = third.surname : null;
		third.name || third.surname=="" ? document.querySelector(".scorer#third > span#name").innerHTML = third.name : null;
		if(third.active){
			document.querySelector(".scorer#third").classList.remove("notActive");
			document.querySelector(".scorer#third").classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-third", "var(--h-row)");
			document.documentElement.style.setProperty("--d-third", "var(--d-standard)");
		}else if (third?.active === false){
			document.querySelector(".scorer#third").classList.add("notActive");
			document.querySelector(".scorer#third").classList.add("notActive");
			document.documentElement.style.setProperty("--h-row-third", "0");
			document.documentElement.style.setProperty("--d-third", "0s");
			document.documentElement.style.setProperty("--d-d-third", "0s");
		}
	}
	document.querySelectorAll(".scorer").forEach((e) => {
		e.classList.remove("last");
	});
	if(document.documentElement.style.getPropertyValue("--h-row-third") != "0")
		document.querySelector("#third").classList.add("last");
	else if(document.documentElement.style.getPropertyValue("--h-row-second") != "0")
		document.querySelector("#second").classList.add("last");
	else if(document.documentElement.style.getPropertyValue("--h-row-head") != "0")
		document.querySelector("#head").classList.add("last");
}

function updateCommentators(obj){
	const main = obj?.main;
	if(main !== undefined){
		main.surname || main.surname=="" ? document.querySelector(".commentator > span#surname").innerHTML = main.surname : null;
		main.name || main.name=="" ? document.querySelector(".commentator > span#name").innerHTML = main.name : null;
	}
}

function updateTechnicalComment(obj){
	const technical = obj?.technical;
	if(technical !== undefined){
		technical.surname || technical.surname=="" ? document.querySelector(".commentator > span#surname").innerHTML = technical.surname : null;
		technical.name || technical.name=="" ? document.querySelector(".commentator > span#name").innerHTML = technical.name : null;
	}
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