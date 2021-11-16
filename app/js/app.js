var socket = io("https://"+window.location.hostname);

socket.on("update", update);

function update(obj){
	console.log(obj);
	//we will have a bunch of this
	//document.getElementById("ScoreA").innerHTML = obj.Teams.Away.Score;
}