function redVerSess() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        const xmlt = new XMLHttpRequest();
        xmlt.open('POST', '/checkstat', true);
        xmlt.setRequestHeader('Content-Type', 'application/json');
        xmlt.send(`{"id":"${user}","token":"${token}"}`);
        xmlt.onload = function () {
            if (xmlt.status === 200) {
                const response = JSON.parse(xmlt.responseText);
                if (response.ok === false) {
                    window.location.href = '/login.html';
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
                if(document.URL.includes('control-center.html')){
                    socket.emit('getData');
                    socket.emit('getActive');
                }else if(document.URL.includes('settings.html')){
                    socket.emit('getSettings');
                    getCurrentUser();
                }else if(document.URL.includes('staff.html')){
                    socket.emit('getOffices');
                }
            } else {
                // User is not in a valid session
                // Redirect to login page
                if (xmlt.status === 500) {
                    alert('Errore: ' + xmlt.status + "\n" + JSON.parse(xmlt.responseText));
                }
                window.location.href = '/login.html';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        };
    } else {
        //redirect to login page
        window.location.href = '/login.html';
    }
}
redVerSess();
