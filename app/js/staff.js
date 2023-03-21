const token = localStorage.getItem('token');
const user = localStorage.getItem('user');


const socket = io({
	auth: {
		id: user,
		token: token
	}
});
socket.emit("getActive");

socket.on('connectOffices', update);
socket.on('updateOffices', update);

function checkAndDeCheck(id){
    try{
        if(document.getElementById(id).checked){
            document.getElementById(id+"-surname").disabled = false;
            document.getElementById(id+"-name").disabled = false;
        }else{
            document.getElementById(id+"-surname").disabled = true;
            document.getElementById(id+"-surname").value = "";
            document.getElementById(id+"-name").disabled = true;
            document.getElementById(id+"-name").value = "";
        }
    }catch(err){
        console.log(err);
    }
}
function update(obj){
    const {umpires, scorers} = obj;
    checkObj(umpires);
    checkObj(scorers);
    const commentators = obj.commentators;
    if(obj.commentators !== undefined){
        Object.keys(commentators).forEach(function(key) {
            const key2 = key=="main"?"Main":key=="technical"?"TC":null;
            updateSingleParameter(commentators[key].surname, "surname", key2);
            updateSingleParameter(commentators[key].name, "name", key2);
        });
    }
}
function checkObj(umpires) {
    if (umpires !== undefined) {
        Object.keys(umpires).forEach(function (key) {
            updateOfficer(key.toLowerCase(), umpires[key]);
        });
    }
}

function updateSingleParameter(value,parameter, key) {
    if (value !== undefined && document.getElementById(key + "-" + parameter).disabled === false)
        document.getElementById(key + "-" + parameter).value = value
}

function updateOfficer(key, officer){
    if (officer?.active) {
        document.getElementById(key).checked = true;
        document.getElementById(key + "-surname").disabled = false;
        document.getElementById(key + "-name").disabled = false;
    } else if (officer?.active === false) {
        document.getElementById(key).checked = false;
        document.getElementById(key + "-surname").disabled = true;
        document.getElementById(key + "-surname").value = "";
        document.getElementById(key + "-name").disabled = true;
        document.getElementById(key + "-name").value = "";
    }
    updateSingleParameter(officer?.surname, "surname", key);
    updateSingleParameter(officer?.name, "name", key);
}

function sendUmpires(){
    let umpires = {};
    let umpire = {};
    umpire.active = document.getElementById("hp").checked;
    umpire.surname = document.getElementById("hp-surname").value;
    umpire.name = document.getElementById("hp-name").value;
    umpires.HP = umpire;
    umpire = {};
    umpire.active = document.getElementById("b1").checked;
    umpire.surname = document.getElementById("b1-surname").value;
    umpire.name = document.getElementById("b1-name").value;
    umpires.B1 = umpire;
    umpire = {};
    umpire.active = document.getElementById("b2").checked;
    umpire.surname = document.getElementById("b2-surname").value;
    umpire.name = document.getElementById("b2-name").value;
    umpires.B2 = umpire;
    umpire = {};
    umpire.active = document.getElementById("b3").checked;
    umpire.surname = document.getElementById("b3-surname").value;
    umpire.name = document.getElementById("b3-name").value;
    umpires.B3 = umpire;
    socket.emit("updateOffices", {umpires: umpires});
}
function sendScorers(){
    let scorers = {};
    let scorer = {};
    scorer.active = document.getElementById("head").checked;
    scorer.surname = document.getElementById("head-surname").value;
    scorer.name = document.getElementById("head-name").value;
    scorers.head = scorer;
    scorer = {};
    scorer.active = document.getElementById("second").checked;
    scorer.surname = document.getElementById("second-surname").value;
    scorer.name = document.getElementById("second-name").value;
    scorers.second = scorer;
    scorer = {};
    scorer.active = document.getElementById("third").checked;
    scorer.surname = document.getElementById("third-surname").value;
    scorer.name = document.getElementById("third-name").value;
    scorers.third = scorer;
    socket.emit("updateOffices", {scorers: scorers});
}
function sendSportcasters(){
    let sportcasters = {};
    let sportcaster = {};
    sportcaster.surname = document.getElementById("Main-surname").value;
    sportcaster.name = document.getElementById("Main-name").value;
    sportcasters.main = sportcaster;
    sportcaster = {};
    sportcaster.surname = document.getElementById("TC-surname").value;
    sportcaster.name = document.getElementById("TC-name").value;
    sportcasters.technical = sportcaster;
    socket.emit("updateOffices", {commentators: sportcasters});
}

function Reset_All(){
    socket.emit("Reset_all_staff");
}
