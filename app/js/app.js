var socket = io("http://"+window.location.hostname+":"+location.port);

socket.on("update", update);

function update(obj){
	//we will have a bunch of this
	//document.getElementById("ScoreA").innerHTML = obj.Teams.Away.Score;

	const darkenColorAway = lightenDarkenColor(obj.Teams.Away.Color,-75);
	const darkenColorHome = lightenDarkenColor(obj.Teams.Home.Color,-75);
	document.querySelector("div.teamName#away").innerHTML = obj.Teams.Away.Name;
	document.querySelector("div.teamName#away").style.background = `radial-gradient(${darkenColorAway} 0%,${obj.Teams.Away.Color} 100%)`;
	document.querySelector("div.teamColor#away").style.background = obj.Teams.Away.Color;
	document.querySelector("div.teamName#home").innerHTML = obj.Teams.Home.Name;
	document.querySelector("div.teamName#home").style.background = `radial-gradient(${darkenColorHome} 0%, ${obj.Teams.Home.Color} 100%)`;
	document.querySelector("div.teamColor#home").style.background = obj.Teams.Home.Color;
}
/**
 * 
 * @param {String} col input color
 * @param {int} amt amount to lighten or darken from -255 to 255
 * @returns {String} Hex color
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
	else if  (r < 0) r = 0;
	var b = ((num >> 8) & 0x00FF) + amt;
	if (b > 255) b = 255;
	else if  (b < 0) b = 0;
	var g = (num & 0x0000FF) + amt;
	if (g > 255) g = 255;
	else if (g < 0) g = 0;
	const result = (g | (b << 8) | (r << 16));
	const formattedNumber = result.toLocaleString('en-US', {
		minimumIntegerDigits: 6,
		useGrouping: false
	  })
	return (usePound?"#":"") + formattedNumber.toString(16);
}