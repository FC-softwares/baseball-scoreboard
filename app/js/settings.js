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
    document.getElementById('BlackenLastInning').value = data.BlackenLastInning;    
});
socket.on('connect_settings',function(data){
    dataDecode = JSON.parse(data);
    document.getElementById('MaxInning').value = dataDecode.MaxInning;
    document.getElementById('BlackenLastInning').value = dataDecode.BlackenLastInning;
});
function UpdateSettings(){
	const MaxInning = document.getElementById('MaxInning').value;
	const BlackenLastInning = document.getElementById('BlackenLastInning').checked;
	socket.emit('update_settings',`{"MaxInning":${MaxInning},"BlackenLastInning":${BlackenLastInning}}`);
}
