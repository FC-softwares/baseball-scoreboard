// Credits to Bootstrap for this snippet
// We don't want to count the "Remember me" checkbox in the validation, so it might need tweaking
// Example starter JavaScript for disabling form submissions if there are invalid fields
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
                window.location.href = '/control-center.html';
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
    };
}else{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}
(function () {
    'use strict'
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})()
function login(username,password){
    if(username==undefined){
        username = document.getElementById('username').value;
        password = document.getElementById('password').value;
    }
    var remember = document.getElementById("remember").checked;
    // convert password to base64
    password = btoa(password);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status === 200) {
            var response_obj = JSON.parse(this.responseText);
            if(response_obj.ok === true){
                localStorage.setItem("token", response_obj.token);
                localStorage.setItem("user", response_obj.id);
                window.location.href = "control-center.html";
            }else{
            }
        }else{
            if(this.readyState == 4){
                switch(this.status){
                    case 500:
                        document.getElementById("ErrorMsg").innerHTML = "Error during login:<br>Please check your internet connection and try again.";
                        document.getElementById("ErrorMsg").classList.remove("visually-hidden");
                        break;
                    case 401:
                        if (username === "guest") {
                            document.getElementById("ErrorMsg").innerHTML = "Error during login:<br>Please check your internet connection and try again.<br>You are trying to login as a guest, <br>please check you are trying to access a demo product.";
                        }else{
                            document.getElementById("ErrorMsg").innerHTML = "Error during login:<br>Please check your username and password and try again.";
                        }
                        document.getElementById("ErrorMsg").classList.remove("visually-hidden");
                        break;
                    case 400:
                        if (username === "guest") {
                            document.getElementById("ErrorMsg").innerHTML = "Error during login:<br>Please check your internet connection and try again.<br>You are trying to login as a guest, <br>please check you are trying to access a demo product.";
                        }else{
                            document.getElementById("ErrorMsg").innerHTML = "Error during login:<br>Please check your username and password and try again.";
                        }
                        document.getElementById("ErrorMsg").classList.remove("visually-hidden");
                        break;
                    default:
                        alert("Errore: "+this.status);
                        break;
                }
                document.querySelector(`#guestSpin`).classList.add("visually-hidden")
                document.querySelector(`#guestButton`).classList.remove("disabled")
                document.querySelector(`#loginSpin`).classList.add("visually-hidden")
                document.querySelector(`#loginButton`).classList.remove("disabled")
            }
        }
    };
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send("{\"username\":\""+username+"\",\"password\":\""+password +"\",\"remember\":\""+remember+"\"}");
    return false;
}

//lines removed from login.html
function loginLoadAnim (btnType) {
    document.querySelector(`#${btnType}Spin`).classList.remove("visually-hidden")
    document.querySelector(`#${btnType}Button`).classList.add("disabled")
}

function CancelLoginGuest() {
    document.querySelector(`#guestSpin`).classList.add("visually-hidden")
    document.querySelector(`#guestButton`).classList.remove("disabled")
}
function LoginGuest(){
    login("guest","guest");
}