var socket = io("http://"+window.location.hostname+":"+location.port);
socket.emit('getActive');
socket.emit('getOffices');

socket.on('updateActive', updateActive);
socket.on('connectActive', updateActive);
socket.on('connectOffices', updateOffices);
socket.on('updateOffices', updateOffices);


function updateActive(json){
	const obj = JSON.parse(json);
	activeDeactiveScoreboard(obj?.umpires, 'umpires.html');
	activeDeactiveScoreboard(obj?.scorers, 'scorers.html');
	activeDeactiveScoreboard(obj?.commentator, 'commentator.html');
	activeDeactiveScoreboard(obj?.technicalComment, 'technicalComment.html');
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

function updateOffices(obj){
	if(document.URL.includes("umpires.html")){
		updateUmpires(obj.umpires);
	}else if(document.URL.includes("scorers.html")){
		updateScorer(obj.scorers);
	}else if(document.URL.includes("commentator.html")){
		updateCommentators(obj.commentators?.main);
	}else if (document.URL.includes("technicalComment.html")){
		updateCommentators(obj.commentators?.technical);
	}
}
function updateUmpires(obj){
	const {HP, B1, B2, B3} = obj || {};
	updateUmpire(HP, "HB", "home");
	updateUmpire(B1, "1B", "B1");
	updateUmpire(B2, "2B", "B2");
	updateUmpire(B3, "3B", "B3");
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
function updateUmpire(umpire, cssID, htmlID) {
	if (umpire !== undefined) {
		umpire.surname || umpire.surname == "" ? document.querySelector(".name#"+ htmlID +" > span#surname").innerHTML = umpire.surname : null;
		umpire.name || umpire.name == "" ? document.querySelector(".name#" + htmlID + " > span#name").innerHTML = umpire.name : null;
		if (umpire.active) {
			document.querySelector(".name#"+htmlID).classList.remove("notActive");
			document.querySelector(".role#"+htmlID).classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-"+cssID, "var(--h-row)");
			document.documentElement.style.setProperty("--d-"+cssID, "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-"+cssID, "var(--d-standard)");
		} else if (umpire?.active === false) {
			document.documentElement.style.setProperty("--h-row-"+cssID, "0");
			document.querySelector(".name#"+htmlID).classList.add("notActive");
			document.querySelector(".role#"+htmlID).classList.add("notActive");
			document.documentElement.style.setProperty("--d-"+cssID, "0s");
			document.documentElement.style.setProperty("--d-d-"+cssID, "0s");
		}
	}
}

function updateScorer(obj){
	const {head, second, third} = obj;
	updateSingleScorer(head, "head");
	updateSingleScorer(second, "second");
	updateSingleScorer(third, "third");
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

function updateSingleScorer(scorer,ID) {
	if (scorer !== undefined) {
		scorer.surname || scorer.surname == "" ? document.querySelector(".scorer#"+ID+" > span#surname").innerHTML = scorer.surname : null;
		scorer.name || scorer.name == "" ? document.querySelector(".scorer#"+ID+" > span#name").innerHTML = scorer.name : null;
		if (scorer.active) {
			document.querySelector(".scorer#"+ID).classList.remove("notActive");
			document.documentElement.style.setProperty("--h-row-"+ID, "var(--h-row)");
			document.documentElement.style.setProperty("--d-"+ID, "var(--d-standard)");
			document.documentElement.style.setProperty("--d-d-"+ID, "var(--d-standard)");
		} else if (scorer?.active === false) {
			document.documentElement.style.setProperty("--h-row-"+ID, "0");
			document.querySelector(".scorer#"+ID).classList.add("notActive");
			document.documentElement.style.setProperty("--d-"+ID, "0s");
			document.documentElement.style.setProperty("--d-d-"+ID, "0s");
		}
	}
}

function updateCommentators(commentor){
	if(commentor !== undefined){
		commentor.surname || commentor.surname=="" ? document.querySelector(".commentator > span#surname").innerHTML = commentor.surname : null;
		commentor.name || commentor.name=="" ? document.querySelector(".commentator > span#name").innerHTML = commentor.name : null;
	}
}