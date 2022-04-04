// JS file to be included in all pages except login page

function LogOut(){
	//make request to logout
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/logout', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${localStorage.getItem('user')}","token":"${localStorage.getItem('token')}"}`);
	xmlt.onload = function() {
		if (xmlt.status == 200) {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			window.location.href = '/';
		}
	}
}

function CheckSession(){
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
					document.getElementById('profile_plc').innerHTML = `<a class="dropdown-toggle nav-link text-dark text-decoration-none pe-0" href="#" id="navUserLinks" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Hi <strong>${name} ${surname}</strong> </a><ul class="dropdown-menu dropdown-menu-end mb-2" aria-labelledby="navUserLinks"><li><a class="dropdown-item" onclick="openExternal('https://www.facchini-pu.it/profile')" target="_blank">Manage profile <i class="bi-box-arrow-up-right"></i></a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item" href="#" title="logout" onclick="LogOut();return false;">Logout</a></li></ul>`;
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
CheckSession();

function openExternal(url){
	xmlt = new XMLHttpRequest();
	xmlt.open('POST', `/openExternal`, true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"url":"${url}"}`);
	xmlt.send();
}