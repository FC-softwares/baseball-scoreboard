<?php
header("Content-Type: application/json");
//error_reporting(0);
if($_SERVER["REQUEST_METHOD"]==="POST"){
    if(isset($_POST["passwd"])){
        $file=fopen("password.json","r");
        $json=fread($file);
        $ok=json_decode($json,true);
        if(in_array($_POST["passwd"],$ok)){
            echo('{"ok":true,"code":200,"result":"Password Correct"}');
            http_response_code(200);
        }else{
            
        }
    }else{
        echo('{"ok":false,"code":400,"result":"password not passed"}');
        http_response_code(400);
    }
}else{
    echo('{"ok":false,"code":405,"result":"'.$_SERVER['REQUEST_METHOD'].' request not allowed"}');
    http_response_code(405);
}
?>