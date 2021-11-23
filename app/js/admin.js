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
	  if (response.ok === true) {
		const socket = io({
		  	auth: {
				id: user,
				token: token
			}
		});
		socket.emit('update_data', {
			test:true
		});
	  } else {
		// User is not in a valid session
		// Redirect to login page
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	  }
	} else {
	  // User is not in a valid session
	  // Redirect to login page
	  if (xmlt.status === 500) {
		alert('Errore: ' + xmlt.status+"\n"+JSON.parse(xmlt.responseText));
	  }
	  localStorage.removeItem('token');
	  localStorage.removeItem('user');
	}
  }
}
// Check if the user is in a valid session via API