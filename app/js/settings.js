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
            socket.emit('getSettings');
			getCurrentUser();
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

socket.on('updateSettings', updateSettings);
socket.on('connectSettings',updateSettings);

function updateSettings(data){
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
	document.getElementById('Resolution').value = data.Resolution;
}
function UpdateSettings(){
	const MaxInning = document.getElementById('MaxInning').value;
	const Resolution = document.getElementById('Resolution').value;
	socket.emit('updateSettings',`{"MaxInning":${MaxInning},"Resolution":${Resolution}}`);
}
function BlackenLastInning(value){
	if(value){
		socket.emit('updateSettings',`{"BlackenLastInning":true}`);
	}else{
		socket.emit('updateSettings',`{"BlackenLastInning":false}`);
	}
}

function getCurrentUser (){
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/checkstat', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}"}`);
	xmlt.onload = function() {
		if (xmlt.status === 200) {
			const response = JSON.parse(xmlt.responseText);
			if (response.ok === true) {
				if(response.user.isOwner==true){
					printUsers(response.user);
					document.getElementById("ProductOwner").value = response.user.name+" "+response.user.surname;
					document.getElementById("ProductOwnerEmail").value = response.user.email;
					document.getElementById("ProductOwnerTeam").value = response.user.team;
				}else{
					window.location.href = '/control-center.html';
				}
			}
		}else{
			if (this.readyState === 4) {
				return false;
			}
		}
	}
}

function printUsers(LoggedUser){
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/getAuthUsers', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}"}`);
	xmlt.onload = function() {
		if (xmlt.status === 200) {
			const response = JSON.parse(xmlt.responseText);
			if (response.ok === true) {
				var UsersHtml = "";
				for (let i = 0; i < response.users.length; i++) {
					if(response.users[i].email == LoggedUser.email){
						UsersHtml += `<li class="list-group-item d-flex"><div class="me-3"><span>${response.users[i].name} ${response.users[i].surname}</span><br><a href="mailto:${response.users[i].email}" class="text-break">${response.users[i].email}</a></div></li>`;
					}else{
						UsersHtml += `<li class="list-group-item d-flex"><div class="me-3"><span>${response.users[i].name} ${response.users[i].surname}</span><br><a href="mailto:${response.users[i].email}" class="text-break">${response.users[i].email}</a></div><button class="btn btn-outline-danger ms-auto my-auto p-0 flex-shrink-0" style="width: 2rem; height: 2rem;" onclick="removeUser('${response.users[i].id}')"><i class="bi bi-x-lg"></i></button></li>`;
					}
				}
				document.getElementById('AuthUsersUl').innerHTML = UsersHtml;
			}
		}
	}
}
function removeUser(id){
	xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/removeAuthUser', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}","user_id":"${id}"}`);
	xmlt.onload = function() {
		if (xmlt.status === 200) {
			const response = JSON.parse(xmlt.responseText);
			if (response.ok === true) {
				document.getElementById('Alert').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> User deleted successfully.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
				getCurrentUser();
			}
		}
	};
}

function addUser(){
	const email = document.getElementById('UserAddEmail').value;
	xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/addAuthUser', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}","email":"${email}"}`);
	xmlt.onload = function() {
		const response = JSON.parse(xmlt.responseText);
		if (xmlt.status === 200) {
			if (response.ok === true) {
				document.getElementById('Alert').innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> User added successfully.  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
				document.getElementById('UserAddEmail').value = '';
			}
		}else{
			document.getElementById('Alert').innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Error!</strong> ${response.error} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
		}
	};
}