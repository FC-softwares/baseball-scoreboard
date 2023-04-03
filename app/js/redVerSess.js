function redVerSess() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user)
        window.location.href = '/login.html';
    const xmlt = new XMLHttpRequest();
    xmlt.open('POST', '/checkstat', true);
    xmlt.setRequestHeader('Content-Type', 'application/json');
    xmlt.send(`{"id":"${user}","token":"${token}"}`);
    xmlt.onload = function () {
        const response = JSON.parse(xmlt.responseText);
        if (xmlt.status !== 200 || !response.ok) {
            if (xmlt.status === 500)
                alert('Errore: ' + xmlt.status + "\n" + response.error);
            window.location.href = '/login.html';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
    }
}
redVerSess();