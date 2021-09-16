<?php
header('Content-Type: application/json');
error_reporting(0);
if($_SERVER['REQUEST_METHOD']==='POST'){
    if($_POST['old']&&$_POST['new']){
        $old_pass=file_get_contents("./passwd.json");
        $old_pass=json_decode($old_pass,true);
        $old_token=file_get_contents("./token.json");
        $old_token=json_decode($old_token,true);
        $old_pass=array_merge($old_pass,$old_token);
        if(in_array($_POST['old'],$old_pass)){
            $old_pass=file_get_contents("./token.json");
            $old_pass=json_decode($old_token,true);
            switch ($_POST['ope']) {
                case 'add':
                    $old_pass[]=$_POST['new'];
                    break;
                case 'sub':
                    $old_pass=array($_POST['new']);
                    break;
                default:
                    echo('{"ok":false,"code":400,"result":"Not valid operation"');
                    http_response_code(400);
                    exit(400);
                    break;
            }
            $file=fopen("token.json","w");
            if($file==false){
                echo('{"ok":false,"code":500,"result":"Unable to open file"}');
                http_response_code(500);
            }else{
                fwrite($file,json_encode($old_pass,JSON_PRETTY_PRINT));
                fclose($file);
                echo('{"ok":true,"code":200,"result":"Password Updated"}');
                http_response_code(200);
            }
        }else{
            echo('{"ok":false,"code":401,"result":"OLD password incorrect"}');
            http_response_code(401);
        }
    }else{
        $missing=array();
        if(!$_POST['old'])
            $missing[]="old";
        if(!$_POST['new'])
            $missing[]="new";
        echo('{"ok":false,"code":400,"result":"data missing","missing":"'.json_encode($missing,true).'"}');
        http_response_code(400);
    }
}else{
    echo('{"ok":false,"code":405,"result":"'.$_SERVER['REQUEST_METHOD'].' request not allowed"}');
    http_response_code(405);
}
?>