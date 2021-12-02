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
function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var remember = document.getElementById("remember").checked;
    sha256(password)
        .then(function(hash){
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
                            alert("Errore: "+this.status+"\n"+JSON.parse(this.responseText));
                            break;
                        case 401:
                            alert("Errore: "+this.status+"\n"+JSON.parse(this.responseText));
                            break;
                        default:
                            alert("Errore: "+this.status);
                            break;
                    }
                }
            }
        };
        xhttp.open("POST", "/login", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send("{\"username\":\""+username+"\",\"password\":\""+hash +"\",\"remember\":\""+remember+"\"}");
        return false;
    });
}
async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}

//lines removed from login.html
function loginLoadAnim (btnType) {
    document.querySelector(`#${btnType}Spin`).classList.remove("visually-hidden")
    document.querySelector(`#${btnType}Button`).classList.add("disabled")
}
