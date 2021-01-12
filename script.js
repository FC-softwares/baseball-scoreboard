var nball = null
var nStrike = null
var nOut = null
var nIning = null
var nBot = null;
load();
function load(){
    fetch("data.json",{cache: "no-cache"})
    .then(response => response.json())
    .then(data =>{
        aggiorna(data);
    })
}
function aggiorna(obj){
    document.getElementById("nameH").value = obj.Home;
    document.getElementById("nameA").value = obj.Away;
    document.getElementById("colorH").value = obj.ColorH;
    document.getElementById("colorA").value = obj.ColorA;
}
function ball(op){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(obj.Ball<3&&op == "+")
                nball = obj.Ball + 1;
            else if(obj.Ball>0&&op == "-")
                nball = obj.Ball - 1;
            else if(op == "0")
                nball = 0;
            else{
                alert("Non puoi eseguire questa operazione");
                return;
            }
            update(null,obj)
        })
}
function strike(op){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(obj.Strike<2&&op == "+")
                nStrike = obj.Strike + 1;
            else if(obj.Strike>0&&op == "-")
                nStrike = obj.Strike - 1;
            else if(op == "0")
                nStrike = 0;
            else{
                alert("Non puoi eseguire questa operazione");
                return;
            }
            update(null,obj)
        })
}
function out(op){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(obj.Out<2&&op == "+")
                nOut = obj.Out + 1
            else if(obj.Out>0&&op=="-")
                nOut = obj.Out -1;
            else if(op == "0")
                nOut = 0;
            else{
                alert("Non puoi eseguire questa operazione");
                return;
            }
            update(null,obj)
        })
}
function ining(op){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(op == "+")
                nIning = obj.Ining + 1;
            else if(op == "-"&&obj.Ining > 0)
                nIning = obj.Ining - 1;
            else if(op == "0")
                nIning = 0;
            else{
                alert("Non puoi eseguire questa operazione");
                return;
            }
        update(null,obj)
    })
}
function top1(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            obj.bot = 2
            update(null,obj)
        })
}
function bot(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            obj.bot = 1
            update(null,obj)
        })
}
function b1(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(obj.b1)
                obj.b1 = false;
            else
                obj.b1 = true;
            update(null,obj)
        })
}
function b2(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(obj.b2)
                obj.b2 = false;
            else
                obj.b2 = true;
            update(null,obj)
        })
}
function b3(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(obj.b3)
                obj.b3 = false;
            else
                obj.b3 = true
            update(null,obj)
        })
}
function resetc(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            nball = 0;
            nStrike = 0;
            update(null,obj)
        })
}
function reseti(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{nball = 0;
            nStrike = 0;
            nOut = 0;
            obj.b1 = false;
            obj.b2 = false;
            obj.b3 = false;
            if(obj.bot==1){
                nIning = obj.Ining + 1;
                nBot = 2;
            }else{
                nBot = 1;
            }
            update(null,obj)
        })
}
function reseta(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            var c=confirm("Una volta eseguita questa operazione non potrai annullarla\nSei Sicuro?");
            if(c==false)
                return;
            nball = 0;
            nStrike = 0;
            nOut = 0;
            obj.b1 = false;
            obj.b2 = false;
            obj.b3 = false;
            nIning = 1;
            obj.bot = 2;
            obj.ScoreH = 0;
            obj.ScoreA = 0;
            update("all",obj);
            location.reload();
        })
}
function sHome(op){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(op == "+")
                obj.ScoreH = obj.ScoreH + 1;
            else if(op == "-"&&obj.ScoreH > 0)
                obj.ScoreH = obj.ScoreH - 1;
            else if(op == "0")
                obj.ScoreH = 0
            else{
                alert("Non puoi eseguire questa operazione")
                return;
            }
            update(null,obj)
        })
}
function sAway(op){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            if(op == "+")
                obj.ScoreA = obj.ScoreA + 1;
            else if(op == "-"&&obj.ScoreA > 0)
                obj.ScoreA = obj.ScoreA - 1;
            else if(op == "0")
                obj.ScoreA = 0;
            else{
                alert("Non puoi eseguire questa operazione")
                return;
            }
            update(null,obj)
        })
}
function parm(){
    fetch("data.json",{cache: "no-cache"})
        .then(response => response.json())
        .then(obj =>{
            update(null,obj)
        })
}
function update(par,obj){
    if(nball!=null)
        obj.Ball = nball;
    if(nStrike!=null)
        obj.Strike = nStrike;
    if(nOut!=null)
        obj.Out = nOut;
    if(nIning!=null)
        obj.Ining = nIning
    if(nBot!=null)
        obj.bot = nBot
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
    ndata = '{\n\t"Away":"' + obj.Away + '",\n\t"ScoreA":'+obj.ScoreA+',\n\t"ColorA":"'+obj.ColorA+'",\n\t"Home":"'+obj.Home+'",\n\t"ScoreH":'+obj.ScoreH+',\n\t"ColorH":"'+obj.ColorH+'",\n\t"Ball":'+obj.Ball+',\n\t"Strike":'+obj.Strike+',\n\t"Out":'+obj.Out+',\n\t"Ining":'+obj.Ining+',\n\t"bot":'+obj.bot+',\n\t"b1":'+obj.b1+',\n\t"b2":'+obj.b2+',\n\t"b3":'+obj.b3+'\n}'
    nData=encodeURI(ndata);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", './update.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {}
    }
    xhr.send("d="+ndata);
}