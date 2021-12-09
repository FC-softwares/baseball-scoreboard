//Js file to be included in all pages exept login page

function LogOut(){
	localStorage.removeItem("user");
	localStorage.removeItem("token");
	location.reload();
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
					//var profileHTML = ``;
					document.getElementById('profile_plc').innerHTML = `<span class="dropdown"><a class="dropdown-toggle text-dark text-decoration-none" href="#" id="navScoreboardLinks" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Hi <strong>${name} ${surname}</strong> </a><ul class="dropdown-menu mb-2" aria-labelledby="navScoreboardLinks"><li><a class="dropdown-item" href="#">Profile <i class="bi-box-arrow-up-right"></i></a></li><li><a class="dropdown-item" href="#" title="logout" onclick="LogOut();return false;">logout</a></li></ul></span>`;
				}
			}else{
				if (this.readyState === 4) {
					return false;
				}
			}
		}
	}else{
		return false;
	}
}
CeackSession();