async function get_data(){
	const response = await fetch("./data.json",{cache: "no-cache",method: "GET",headers: {'Accept': 'application/json','Content-Type': 'application/json',},})
	return response.json()
}
function update_data(data) {
	// document.getElementById("NameA").innerHTML = data.Teams.Away.Name;
	// document.getElementById("ScoreA").innerHTML = data.Teams.Away.Score;
	// document.getElementById("NameH").innerHTML = data.Teams.Home.Name;
	// document.getElementById("ScoreH").innerHTML = data.Teams.Home.Score;
	// document.getElementById("Ball").innerHTML = data.Ball;
	// document.getElementById("Strike").innerHTML = data.Strike;
}