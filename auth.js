function update(){
    const digest = async ({ algorithm = "SHA-256", message }) =>
        Array.prototype.map
          .call(
            new Uint8Array(
              await crypto.subtle.digest(algorithm, new TextEncoder().encode(message))
            ),
            (x) => ("0" + x.toString(16)).slice(-2)
          )
          .join("");
    
    old=document.getElementById("oldpsw").value;
    new_p=document.getElementById("newpsw").value;
    rep_pass=document.getElementById("repeatpsw").value;

    if(new_p!=rep_pass){
        alert("The New password are different")
        return;
    }
    if(document.getElementById("opt1").checked)
        opt="add";
    else if(document.getElementById("opt2").checked)
        opt="sub";
    else
        return;
    digest({message: new_p})
          .then(ins=>{
              new_p=ins;
              digest({message: old})
                .then(ins2=>{
                    old=ins2;
                    submit(new_p,old,opt);
                })
          })
}
function submit(new_p,old,opt){
    ndata="old="+old+"&new="+new_p+"&ope="+opt;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", './update_pass.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status != 200) {
            window.alert("An error occurred while updating password\nSee console for more information\nERROR code: "+this.status);
            console.debug("Error while sending request\nCODE:"+this.status+"\nRECIVED: '"+this.response+"'");
            
        }else{
            if(opt="sub"&&this.status==200&&this.readyState === XMLHttpRequest.DONE)
                window.location.replace("./auth.html");
        }
    }
    xhr.send(ndata);
}
function update2(){
    const digest = async ({ algorithm = "SHA-256", message }) =>
        Array.prototype.map
          .call(
            new Uint8Array(
              await crypto.subtle.digest(algorithm, new TextEncoder().encode(message))
            ),
            (x) => ("0" + x.toString(16)).slice(-2)
          )
          .join("");
    
    old=document.getElementById("passwd").value;
    new_t=Math.random().toString(16).substr(2, 8);;

    opt="sub";
    digest({message: new_t})
          .then(ins=>{
                new_t=ins;
                if(submit2(new_t,old,opt))
                    document.getElementById("token").value=new_t;
          })
}

function submit2(new_p,old,opt){
    ndata="old="+old+"&new="+new_p+"&ope="+opt;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", './update_token.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status != 200) {
            window.alert("An error occurred while updating score\nSee console for more information\nERROR code: "+this.status);
            console.debug("Error while sending request\nCODE:"+this.status+"\nRECIVED: '"+this.response+"'");
            
        }
    }
    xhr.send(ndata);
    return true;
}