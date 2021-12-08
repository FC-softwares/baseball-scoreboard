//Js file to be included in all pages exept login page

function LogOut(){
	localStorage.removeItem("user");
	localStorage.removeItem("token");
}

function CeackSession(){
	const id = localStorage.getItem('user');
	const token = localStorage.getItem('token');
	if (id&&token) {
		const xmlt = new XMLHttpRequest();
		xmlt.open('POST', '/checkstat', true);
		xmlt.setRequestHeader('Content-Type', 'application/json');
		xmlt.send(`{"id":"${id}","token":"${token}"}`);
		xmlt.onload = function() {
			if (xmlt.status === 200) {
				const response = JSON.parse(xmlt.responseText);
				if (response.ok === true) {
					//modify the HTML based on the user
					const { name, surname, email} = response.user
					//document.getElementById('user_name').innerHTML = name;
				}
			}else{
				if (this.readyState === 4) {
					return false;
				}
			}
		}
	}
}