const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token && user) {
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', 'https://api.facchini-pu.it/checkstat', true);
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
//To add for all the variables
function Ball(opr){
	if(opr!="+"&&opr!="-"&&opr!="0")
		return NaN;
	socket.emit('update_data', `{"Ball":"${opr}"}`);
	return true;
}