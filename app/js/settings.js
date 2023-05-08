import {io} from '/socket.io/socket.io.esm.min.js';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

const socket = io({
	auth: {
		id: user,
		token: token
	}
});

socket.on('updateSettings', updateSettings);
socket.on('connectSettings',updateSettings);

socket.emit('getSettings');
getCurrentUser();

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
	document.getElementById('enableWSBC').checked = data.fibsStreaming;
	document.getElementById('WSBCID').disabled = !data.fibsStreaming;
	document.getElementById('WSBCID').value = data.fibsStreamingCode;
}
function UpdateSettings(){
	const MaxInning = document.getElementById('MaxInning').value;
	const Resolution = document.getElementById('Resolution').value;
	const enableWSBC = document.getElementById('enableWSBC').checked;
	const WSBCID = document.getElementById('WSBCID').value;
	socket.emit('updateSettings',JSON.stringify({
		MaxInning:MaxInning,
		Resolution:Resolution,
		fibsStreaming:enableWSBC,
		fibsStreamingCode:WSBCID
	}));
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
		if(xmlt.status !== 200 && this.readyState !== 4)
			return false;
		const response = JSON.parse(xmlt.responseText);
		if (response.ok !== true)
			return false;
		if(response.user.isOwner !== true)
			return window.location.href = '/control-center.html';
		printUsers(response.user);
		document.getElementById("ProductOwner").value = response.user.name+" "+response.user.surname;
		document.getElementById("ProductOwnerEmail").value = response.user.email;
		document.getElementById("ProductOwnerTeam").value = response.user.team;
	}
}

function printUsers(LoggedUser){
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/getAuthUsers', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}"}`);
	xmlt.onload = function() {
		if (xmlt.status !== 200 && this.readyState !== 4)
			return false;
		const response = JSON.parse(xmlt.responseText);
		if (response.ok !== true)
			return false;
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
function removeUser(id){
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/removeAuthUser', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}","user_id":"${id}"}`);
	xmlt.onload = function() {
		const response = JSON.parse(xmlt.responseText);
		const error = response.error || response.message || 'Unknown error';
		if(checkError(this, xmlt, response, error)) return;
		openAlert('User removed successfully.', 'alert-success');
		getCurrentUser();
	};
}

function addUser(){
	const email = document.getElementById('UserAddEmail').value;
	const xmlt = new XMLHttpRequest();
	xmlt.open('POST', '/addAuthUser', true);
	xmlt.setRequestHeader('Content-Type', 'application/json');
	xmlt.send(`{"id":"${user}","token":"${token}","email":"${email}"}`);
	xmlt.onload = function() {
		const response = JSON.parse(xmlt.responseText);
		const error = response.error || response.message || 'Unknown error';
		if(checkError(this, xmlt, response, error)) return;
		openAlert('User added successfully.','alert-success');
		document.getElementById('UserAddEmail').value = '';
		getCurrentUser();
	};
}

function checkError(that, xmlt, response, error) {
	if (xmlt.status !== 200 && that.readyState !== 4 || !response.ok){
		openAlert(`<strong>Error!</strong> ${error}`, 'alert-danger');
		return true;
	}
	return false;
}

function openAlert(message, className){
	document.getElementById('Alert').innerHTML = message;
	document.getElementById('Alert').classList.add(className);
	document.getElementById('Alert').classList.add('show');
	return setTimeout(() => {
		document.getElementById('Alert').innerHTML = '';
		document.getElementById('Alert').classList.remove('show');
		document.getElementById('Alert').classList.remove(className);
	}, 5000);
}
const exports = {updateSettings, UpdateSettings, BlackenLastInning, getCurrentUser, printUsers, removeUser, addUser};
export default exports;
export {updateSettings, UpdateSettings, BlackenLastInning, getCurrentUser, printUsers, removeUser, addUser};