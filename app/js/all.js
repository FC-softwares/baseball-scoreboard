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
	if (!id||!token)
		return false;
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/checkstat', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(JSON.stringify({id,token}));
	xmlt.onload = function() {
		if (xmlt.status !== 200) {
			if (this.readyState !== 4)
				return false;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			window.location.href = '/';
			return false;
		}
		const response = JSON.parse(xmlt.responseText);
		if (response.ok !== true)
			return false;
		const { name, surname} = response.user;
		document.getElementById('profile_plc').innerHTML = `<a class="dropdown-toggle text-dark text-decoration-none pe-0" href="#" id="navUserLinks" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Hi <strong><span class="me-1">${name}</span><span class="d-sm-none d-md-inline d-lg-none d-xl-inline">${surname}</span></strong></a><ul class="dropdown-menu dropdown-menu-end mb-2" aria-labelledby="navUserLinks"><li><a class="dropdown-item" onclick="openExternal('https://www.fc-sofftware.it/profile')" target="_blank">Manage profile <i class="bi-box-arrow-up-right"></i></a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item" href="#" title="logout" onclick="LogOut();return false;">Logout</a></li></ul>`;
		return true;
	}
}
CheckSession();

function openExternal(url){
	if(checkElectron(url)) return;
	xmlt = new XMLHttpRequest();
	xmlt.open('POST', `/openExternal`, true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"url":"${url}"}`);
	xmlt.send();
}

function newWindow(url,width,height){
	if(checkElectron(url)) return;
	xmlt = new XMLHttpRequest();
	xmlt.open('POST', `/newWindow`, true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"url":"${url}","width":${width},"height":${height}}`);
	xmlt.send();
}
function checkElectron(url){
	if (navigator.userAgent.toLowerCase().indexOf(' electron/')== -1) {
		// We are not in electron
		window.open(url, '_blank');
		return true;
	}
	return false;
}