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
            socket.emit('get_settings');
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

socket.on('update_settings', function(data){
    document.getElementById('MaxInning').value = data.MaxInning;
	if(data.BlackenLastInning){
		document.getElementById("BlackenLastInningTrue").classList.remove("btn-outline-primary");
		document.getElementById("BlackenLastInningTrue").classList.add("btn-primary");
		document.getElementById("BlackenLastInningFalse").classList.remove("btn-primary");
		document.getElementById("BlackenLastInningFalse").classList.add("btn-outline-primary");
	}else{
		document.getElementById("BlackenLastInningTrue").classList.remove("btn-primary");
		document.getElementById("BlackenLastInningTrue").classList.add("btn-outline-primary");
		document.getElementById("BlackenLastInningFalse").classList.remove("btn-outline-primary");
		document.getElementById("BlackenLastInningFalse").classList.add("btn-primary");
	}
});
socket.on('connect_settings',function(data){
    dataDecode = JSON.parse(data);
    document.getElementById('MaxInning').value = dataDecode.MaxInning;
    if(data.BlackenLastInning){
		document.getElementById("BlackenLastInningTrue").classList.remove("btn-outline-primary");
		document.getElementById("BlackenLastInningTrue").classList.add("btn-primary");
		document.getElementById("BlackenLastInningFalse").classList.remove("btn-primary");
		document.getElementById("BlackenLastInningFalse").classList.add("btn-outline-primary");
	}else{
		document.getElementById("BlackenLastInningTrue").classList.remove("btn-primary");
		document.getElementById("BlackenLastInningTrue").classList.add("btn-outline-primary");
		document.getElementById("BlackenLastInningFalse").classList.remove("btn-outline-primary");
		document.getElementById("BlackenLastInningFalse").classList.add("btn-primary");
	}
});
function UpdateSettings(){
	const MaxInning = document.getElementById('MaxInning').value;
	socket.emit('update_settings',`{"MaxInning":${MaxInning}}`);
}
function BlackenLastInning(value){
	if(value){
		socket.emit('update_settings',`{"BlackenLastInning":true}`);
	}else{
		socket.emit('update_settings',`{"BlackenLastInning":false}`);
	}
}