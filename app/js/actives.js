
function updateActive(data){
	const dataObj = JSON.parse(data);
	Object.entries(dataObj).forEach(([key, value]) => {
		if(key=="main"){
			updateMainButton(value);
		}else if (key=="pre") {
			updatePreGameButton(value);
		}else if (key=="post") {
			updatePostGameButton(value);
		}else if (key=="inning") {
			updatePartialsButton(value);
		}else if (key=="umpires") {
            updateUmpiresButton(value);
        }else if (key=="scorers") {
            updateScorersButton(value);
        }else if (key == "commentator") {
            updateCommentatorButton(value);
        }else if (key == "technicalComment"){
            updateTechnicalCommentButton(value);
        }
	});
}
function updateTechnicalCommentButton(value) {
    if (value == true) {
        try {
            document.getElementById('technicalCommentatorOn').classList.remove("btn-outline-success");
            document.getElementById('technicalCommentatorOn').classList.add("btn-success");
            document.getElementById('technicalCommentatorOff').classList.remove("btn-danger");
            document.getElementById('technicalCommentatorOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('technicalCommentatorOn').classList.remove("btn-success");
            document.getElementById('technicalCommentatorOn').classList.add("btn-outline-success");
            document.getElementById('technicalCommentatorOff').classList.remove("btn-outline-danger");
            document.getElementById('technicalCommentatorOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updateCommentatorButton(value) {
    if (value == true) {
        try {
            document.getElementById('sportscasterOn').classList.remove("btn-outline-success");
            document.getElementById('sportscasterOn').classList.add("btn-success");
            document.getElementById('sportscasterOff').classList.remove("btn-danger");
            document.getElementById('sportscasterOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('sportscasterOn').classList.remove("btn-success");
            document.getElementById('sportscasterOn').classList.add("btn-outline-success");
            document.getElementById('sportscasterOff').classList.remove("btn-outline-danger");
            document.getElementById('sportscasterOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updateScorersButton(value) {
    if (value == true) {
        try {
            document.getElementById('scorersOn').classList.remove("btn-outline-success");
            document.getElementById('scorersOn').classList.add("btn-success");
            document.getElementById('scorersOff').classList.remove("btn-danger");
            document.getElementById('scorersOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('scorersOn').classList.remove("btn-success");
            document.getElementById('scorersOn').classList.add("btn-outline-success");
            document.getElementById('scorersOff').classList.remove("btn-outline-danger");
            document.getElementById('scorersOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updateUmpiresButton(value) {
    if (value == true) {
        try {
            document.getElementById('umpiresOn').classList.remove("btn-outline-success");
            document.getElementById('umpiresOn').classList.add("btn-success");
            document.getElementById('umpiresOff').classList.remove("btn-danger");
            document.getElementById('umpiresOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('umpiresOn').classList.remove("btn-success");
            document.getElementById('umpiresOn').classList.add("btn-outline-success");
            document.getElementById('umpiresOff').classList.remove("btn-outline-danger");
            document.getElementById('umpiresOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updatePartialsButton(value) {
    if (value == true) {
        try {
            document.getElementById('inningOn').classList.remove("btn-outline-success");
            document.getElementById('inningOn').classList.add("btn-success");
            document.getElementById('inningOff').classList.remove("btn-danger");
            document.getElementById('inningOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('inningOn').classList.remove("btn-success");
            document.getElementById('inningOn').classList.add("btn-outline-success");
            document.getElementById('inningOff').classList.remove("btn-outline-danger");
            document.getElementById('inningOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updatePostGameButton(value) {
    if (value == true) {
        try {
            document.getElementById('postOn').classList.remove("btn-outline-success");
            document.getElementById('postOn').classList.add("btn-success");
            document.getElementById('postOff').classList.remove("btn-danger");
            document.getElementById('postOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('postOn').classList.remove("btn-success");
            document.getElementById('postOn').classList.add("btn-outline-success");
            document.getElementById('postOff').classList.remove("btn-outline-danger");
            document.getElementById('postOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updatePreGameButton(value) {
    if (value == true) {
        try {
            document.getElementById('preOn').classList.remove("btn-outline-success");
            document.getElementById('preOn').classList.add("btn-success");
            document.getElementById('preOff').classList.remove("btn-danger");
            document.getElementById('preOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('preOn').classList.remove("btn-success");
            document.getElementById('preOn').classList.add("btn-outline-success");
            document.getElementById('preOff').classList.remove("btn-outline-danger");
            document.getElementById('preOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function updateMainButton(value) {
    if (value == true) {
        try {
            document.getElementById('mainOn').classList.remove("btn-outline-success");
            document.getElementById('mainOn').classList.add("btn-success");
            document.getElementById('mainOff').classList.remove("btn-danger");
            document.getElementById('mainOff').classList.add("btn-outline-danger");
        } catch (e) {
            console.log(e);
        }
    } else {
        try {
            document.getElementById('mainOn').classList.remove("btn-success");
            document.getElementById('mainOn').classList.add("btn-outline-success");
            document.getElementById('mainOff').classList.remove("btn-outline-danger");
            document.getElementById('mainOff').classList.add("btn-danger");
        } catch (e) {
            console.log(e);
        }
    }
}

function main(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"main":${opr}}`);
	return true;
}
function preGame(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"pre":${opr}}`);
	return true;
}
function postGame(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"post":${opr}}`);
	return true;
}
function inning(opr){
	if(opr!=true&&opr!=false)
		return null;
	socket.emit('updateActive',`{"inning":${opr}}`);
	return true;
}
function umpires(opr){
    if(opr!=true&&opr!=false)
        return null;
    socket.emit('updateActive',`{"umpires":${opr}}`);
    return true;
}
function scorers(opr){
    if(opr!=true&&opr!=false)
        return null;
    socket.emit('updateActive',`{"scorers":${opr}}`);
    return true;
}
function sportscaster(opr){
    if(opr!=true&&opr!=false)
        return null;
    socket.emit('updateActive',`{"commentator":${opr}}`);
    return true;
}
function technicalCommentator(opr){
    if(opr!=true&&opr!=false)
        return null;
    socket.emit('updateActive',`{"technicalComment":${opr}}`);
    return true;
}