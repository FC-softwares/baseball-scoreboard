function update2(){
    fetch("settings.json",{"cache":"no-cache"})
    .then(response => response.json())
    .then(set=>{
        set.max_inning=document.getElementById("max_ing").value;
        set.dark_current=document.getElementById("dark_current").value;
        ndata="max_inning="+set.max_inning+"&dark_current="+set.dark_current;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", './settings.php', true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status != 200) {
                window.alert("An error occurred while updating score\nSee console for more information\nERROR code: "+this.status);
                console.debug("Error while sending request\nCODE:"+this.status+"\nRECIVED: '"+this.response+"'");
            }
        }
        xhr.send(ndata);
    });
}
function init(){
    fetch("settings.json",{"cache":"no-cache"})
    .then(response => response.json())
    .then(data=>{
        document.getElementById("max_ing").value=data.max_inning
        document.getElementById("dark_current").value=data.dark_current
    })
}
init();