function reseta() {
	fetch("./data.json",{cache: "no-cache",method: "GET",headers: {'Accept': 'application/json','Content-Type': 'application/json',},})
	.then(response => response.json())
    .then(obj =>{
		update(obj,"all")
	})
}
function update(data,ops=false) {
	switch (ops) {
		case "all":
			//Teams
			//Away
			data.Teams.Away.Name = "AWAY"
			data.Teams.Away.Score = 0
			data.Teams.Away.Color = "#000000"
			//Home
			data.Teams.Home.Name = "HOME"
			data.Teams.Home.Score = 0
			data.Teams.Home.Color = "#000000"
			//Count
			data.Ball = 0
			data.Strike = 0
			data.Out = 0
			//Ining
			data.Ining = 1
			data.Arrow = 2
			//Bases
			data.Bases[1] = false
			data.Bases[2] = false
			data.Bases[3] = false
			
			data.Int={1: {A: 0,H: 0}}
			break;
		default:
			break;
	}
	ndata = "";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", './php/update.php', true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (this.readyState === XMLHttpRequest.DONE && this.status != 200) {
			window.alert("An error occurred while updating score\nSee console for more information\nERROR code: "+this.status);
			console.debug("Error while sending request\nCODE:"+this.status+"\nRECIVED: '"+this.response+"'");
		}
	}
	xhr.send(ndata);
}