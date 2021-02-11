<?php
if($_SERVER['REQUEST_METHOD']==='POST'){
    if(isset($_POST['d'])){
        $file = fopen("data.json", "w");
        if($file==false){
            echo('{"ok":false,"code":500,"result":"Unable to open file"}');
            http_response_code(500);
        }else{
            $old=file_get_contents("./data.json");
            $old=json_decode($old, true);
            $new=json_decode($_POST['d'],true);
            //comparing difference
            $diff=array_diff_assoc($new,$old);
            $diff=json_encode($diff);
            //Saving JSON
            fwrite($file, $_POST['d']);
            fclose($file);
            //oppening LOG
            $log=fopen("changes.log",'a');
            if($log==false){
                echo('{"ok":true,"code":200,"result":"changes done","log":false}');
                http_response_code(200);
            }else{
                //Saving log
                $txt_log="[INFO] ".date("d-m-Y H:i:s")." chages done: ".$diff."\n";
                fwrite($log,$txt_log);
                fclose($log);
                echo('{"ok":true,"code":200,"result":"changes done","changes":,"log":true}');
                http_response_code(200);
            }
        }
    }else{
        echo('{"ok":false,"code":400,"result":"d for data set is not set"}');
        http_response_code(400);
    }
}else{
    echo('{"ok":false,"code":405,"result":"'.$_SERVER['REQUEST_METHOD'].' request not allowed"}');
    http_response_code(405);
}
?> 