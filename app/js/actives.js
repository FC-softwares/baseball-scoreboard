
function updateActive(data){
	const dataObj = JSON.parse(data);
	Object.entries(dataObj).forEach(([key, value]) => {
        if (key == "commentator") {
            updateButton(value, "sportscaster");
        }else if (key == "technicalComment"){
            updateButton(value, "technicalCommentator");
        }else {
            updateButton(value, key);
        }
	});
}
function updateButton(value, id) {
    try{
        if (value) {
            document.getElementById(id + "On").classList.remove("btn-outline-success");
            document.getElementById(id + "On").classList.add("btn-success");
            document.getElementById(id + "Off").classList.remove("btn-danger");
            document.getElementById(id + "Off").classList.add("btn-outline-danger");
        } else {
            document.getElementById(id + "On").classList.remove("btn-success");
            document.getElementById(id + "On").classList.add("btn-outline-success");
            document.getElementById(id + "Off").classList.remove("btn-outline-danger");
            document.getElementById(id + "Off").classList.add("btn-danger");
        }
    }catch(err){
        console.log(err);
    }
}

function buttonOpr(opr, id){
    if (opr!=true&&opr!=false)
        return null;
    socket.emit('updateActive',`{"${id}":${opr}}`);
    return true;
}

function allOff(){
    socket.emit('updateActive',`{"AllOff":true}`);
    return true;
}
export {updateActive, buttonOpr, allOff};