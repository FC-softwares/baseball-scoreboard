var nball = null
var nStrike = null
var nOut = null
var nIning = null
var nBot = null;
var obj = JSON.parse(data)
document.getElementById("nameH").value = obj.Home;
document.getElementById("nameA").value = obj.Away;
document.getElementById("colorH").value = obj.ColorH;
document.getElementById("colorA").value = obj.ColorA;
function ball(op){
    if(obj.Ball<3&&op == "+"){
        nball = obj.Ball + 1;
    }else if(obj.Ball>0&&op == "-"){
        nball = obj.Ball - 1;
    }else if(op == "0"){
        nball = 0;
    }else{
        alert("Non puoi eseguire questa operazione");
        return;
    }
    update()
}
function strike(op){
    if(obj.Strike<2&&op == "+"){
        nStrike = obj.Strike + 1;
    }else if(obj.Strike>0&&op == "-"){
        nStrike = obj.Strike - 1;
    }else if(op == "0"){
        nStrike = 0;
    }else{
        alert("Non puoi eseguire questa operazione");
        return;
    }
    update()
}
function out(op){
    if(obj.Out<2&&op == "+"){
        nOut = obj.Out + 1
    }else if(obj.Out>0&&op=="-"){
        nOut = obj.Out -1;
    }else if(op == "0"){
        nOut = 0;
    }else{
        alert("Non puoi eseguire questa operazione");
        return;
    }
    update()
}
function ining(op){
    if(op == "+"){
        nIning = obj.Ining + 1;
    }else if(op == "-"&&obj.Ining > 0){
        nIning = obj.Ining - 1;
    }else if(op == "0"){
        nIning = 0;
    }else{
        alert("Non puoi eseguire questa operazione");
        return;
    }
    update()
}
function top1(){
    obj.bot = 2
    update()
}
function bot(){
    obj.bot = 1
    update()
}
function nul(){
    obj.bot = 0;
    update()
}
function b1(){
    if(obj.b1){
        obj.b1 = false;
    }else{
        obj.b1 = true;
    }
    update()
}
function b2(){
    if(obj.b2){
        obj.b2 = false;
    }else{
        obj.b2 = true;
    }
    update()
}
function b3(){
    if(obj.b3){
        obj.b3 = false;
    }else{
        obj.b3 = true;
    }
    update()
}
function resetc(){
    nball = 0;
    nStrike = 0;
    update()
}
function reseti(){
    nball = 0;
    nStrike = 0;
    nOut = 0;
    obj.b1 = false;
    obj.b2 = false;
    obj.b3 = false;
    if(obj.bot){
        nIning = obj.Ining + 1;
        nBot = false;
    }else{
        nBot = true;
    }
    update()
}
function reseta(){
    var c=confirm("Una volta eseguita questa operazione non potrai annullarla\nSei Sicuro?");
    if(c==false){
        return;
    }
    nball = 0;
    nStrike = 0;
    nOut = 0;
    obj.b1 = false;
    obj.b2 = false;
    obj.b3 = false;
    nIning = 1;
    obj.bot = null;
    obj.ScoreH = 0;
    obj.ScoreA = 0;
    update("all");
    location.reload();
}
function sHome(op){
    if(op == "+"){
        obj.ScoreH = obj.ScoreH + 1;
    }
    if(op == "-"&&obj.ScoreH > 0){
        obj.ScoreH = obj.ScoreH - 1;
    }
    if(op == "0"){
        obj.ScoreH = 0;
    }
    update()
}
function sAway(op){
    if(op == "+"){
        obj.ScoreA = obj.ScoreA + 1;
    }
    if(op == "-"&&obj.ScoreA > 0){
        obj.ScoreA = obj.ScoreA - 1;
    }
    if(op == "0"){
        obj.ScoreA = 0;
    }
    update()
}
function update(par){
    if(nball!=null){
        obj.Ball = nball;
    }
    if(nStrike!=null){
        obj.Strike = nStrike;
    }
    if(nOut!=null){
        obj.Out = nOut;
    }
    if(nIning!=null){
        obj.Ining = nIning
    }
    if(nBot!=null){
        obj.bot = nBot
    }
    obj.Away=document.getElementById("nameA").value;
    obj.Home=document.getElementById("nameH").value;
    obj.ColorA=document.getElementById("colorA").value;
    obj.ColorH=document.getElementById("colorH").value;
    if(par == "all"){
        obj.Away = "AWAY";
        obj.Home = "HOME";
        obj.ColorA = "#000000";
        obj.ColorH = "#000000";
    }
    ndata = 'var data=\'{"Away":"' + obj.Away + '","ScoreA":'+obj.ScoreA+',"ColorA":"'+obj.ColorA+'","Home":"'+obj.Home+'","ScoreH":'+obj.ScoreH+',"ColorH":"'+obj.ColorH+'","Ball":'+obj.Ball+',"Strike":'+obj.Strike+',"Out":'+obj.Out+',"Ining":'+obj.Ining+',"bot":'+obj.bot+',"b1":'+obj.b1+',"b2":'+obj.b2+',"b3":'+obj.b3+'}\''
    console.log(ndata)
    nData=encodeURI(ndata);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", './update.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var iframe = document.getElementById('scoreboard');
        iframe.src = iframe.src;
    }
    }
    xhr.send("d="+ndata);
}