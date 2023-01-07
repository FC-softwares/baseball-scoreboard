const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token && user) {
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/checkstat', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}"}`);
	xmlt.onload = function() {
		if (xmlt.status === 200) {
			const response = JSON.parse(xmlt.responseText);
			if (response.ok === false) {
				window.location.href = '/login.html';
				localStorage.removeItem('token');
				localStorage.removeItem('user');
			}
            socket.emit("getOffices");
		} else {
			// User is not in a valid session
			// Redirect to login page
			if (xmlt.status === 500) {
				alert('Errore: ' + xmlt.status+"\n"+JSON.parse(xmlt.responseText));
			}
			window.location.href = '/login.html';
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
	}
}else{
	//redirect to login page
	window.location.href = '/login.html';
}

const socket = io({
	auth: {
		id: user,
		token: token
	}
});
socket.emit("getActive");

socket.on('connectOffices', update);
socket.on('updateOffices', update);
socket.on('connectActive', updateActive);
socket.on('updateActive', updateActive);

function checkAndDeCheck(id){
    try{
        if(document.getElementById(id).checked){
            document.getElementById(id+"-surname").disabled = false;
            document.getElementById(id+"-name").disabled = false;
        }else{
            document.getElementById(id+"-surname").disabled = true;
            document.getElementById(id+"-surname").value = "";
            document.getElementById(id+"-name").disabled = true;
            document.getElementById(id+"-name").value = "";
        }
    }catch(err){
        console.log(err);
    }
}
function update(obj){
    const umpires = obj.umpires;
    if(obj.umpires !== undefined){
        Object.keys(umpires).forEach(function(key) {
            const key2 = key.toLowerCase();
            if(umpires[key]?.active){
                document.getElementById(key2).checked = true;
                document.getElementById(key2+"-surname").disabled = false;
                if(umpires[key]?.surname !== undefined)
                    document.getElementById(key2+"-surname").value = umpires[key].surname;
                document.getElementById(key2+"-name").disabled = false;
                if(umpires[key]?.name !== undefined)
                    document.getElementById(key2+"-name").value = umpires[key].name;
            }else if (umpires[key]?.active === false){
                document.getElementById(key2).checked = false;
                document.getElementById(key2+"-surname").disabled = true;
                document.getElementById(key2+"-surname").value = "";
                document.getElementById(key2+"-name").disabled = true;
                document.getElementById(key2+"-name").value = "";
            }
        });
    }
    const scorers = obj.scorers;
    if(obj.scorers !== undefined){
        Object.keys(scorers).forEach(function(key) {
            const key2 = key.toLowerCase();
            if(scorers[key]?.active){
                document.getElementById(key2).checked = true;
                document.getElementById(key2+"-surname").disabled = false;
                if(scorers[key]?.surname !== undefined)
                    document.getElementById(key2+"-surname").value = scorers[key].surname;
                document.getElementById(key2+"-name").disabled = false;
                if(scorers[key]?.name !== undefined)
                    document.getElementById(key2+"-name").value = scorers[key].name;
            }else if (scorers[key]?.active === false){
                document.getElementById(key2).checked = false;
                document.getElementById(key2+"-surname").disabled = true;
                document.getElementById(key2+"-surname").value = "";
                document.getElementById(key2+"-name").disabled = true;
                document.getElementById(key2+"-name").value = "";
            }
        });
    }
    const commentators = obj.commentators;
    if(obj.commentators !== undefined){
        Object.keys(commentators).forEach(function(key) {
            const key2 = key=="main"?"Main":key=="technical"?"TC":null;
            if(commentators[key]?.surname !== undefined)
                document.getElementById(key2+"-surname").value = commentators[key].surname;
            if(commentators[key]?.name !== undefined)
                document.getElementById(key2+"-name").value = commentators[key].name;
        });
    }
}
function sendUmpires(){
    let umpires = {};
    let umpire = {};
    umpire.active = document.getElementById("hp").checked;
    umpire.surname = document.getElementById("hp-surname").value;
    umpire.name = document.getElementById("hp-name").value;
    umpires.HP = umpire;
    umpire = {};
    umpire.active = document.getElementById("b1").checked;
    umpire.surname = document.getElementById("b1-surname").value;
    umpire.name = document.getElementById("b1-name").value;
    umpires.B1 = umpire;
    umpire = {};
    umpire.active = document.getElementById("b2").checked;
    umpire.surname = document.getElementById("b2-surname").value;
    umpire.name = document.getElementById("b2-name").value;
    umpires.B2 = umpire;
    umpire = {};
    umpire.active = document.getElementById("b3").checked;
    umpire.surname = document.getElementById("b3-surname").value;
    umpire.name = document.getElementById("b3-name").value;
    umpires.B3 = umpire;
    socket.emit("updateOffices", {umpires: umpires});
}
function sendScorers(){
    let scorers = {};
    let scorer = {};
    scorer.active = document.getElementById("head").checked;
    scorer.surname = document.getElementById("head-surname").value;
    scorer.name = document.getElementById("head-name").value;
    scorers.head = scorer;
    scorer = {};
    scorer.active = document.getElementById("second").checked;
    scorer.surname = document.getElementById("second-surname").value;
    scorer.name = document.getElementById("second-name").value;
    scorers.second = scorer;
    scorer = {};
    scorer.active = document.getElementById("third").checked;
    scorer.surname = document.getElementById("third-surname").value;
    scorer.name = document.getElementById("third-name").value;
    scorers.third = scorer;
    socket.emit("updateOffices", {scorers: scorers});
}
function sendSportcasters(){
    let sportcasters = {};
    let sportcaster = {};
    sportcaster.surname = document.getElementById("Main-surname").value;
    sportcaster.name = document.getElementById("Main-name").value;
    sportcasters.main = sportcaster;
    sportcaster = {};
    sportcaster.surname = document.getElementById("TC-surname").value;
    sportcaster.name = document.getElementById("TC-name").value;
    sportcasters.technical = sportcaster;
    socket.emit("updateOffices", {commentators: sportcasters});
}

function Reset_All(){
    socket.emit("Reset_All_Staff");
}
