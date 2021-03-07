<?php
header('Content-Type: application/json');
if($_SERVER['REQUEST_METHOD']==='POST'){
    $old1=file_get_contents("./data.json");
        $old=json_decode($old1, true);
        //Saving array types required
        $types=array();
        foreach ($old as $key => $value) {
            $types[]=$key;
    }
    $new=array();
    //Checking passed items
    $i=0;
    $missing=array();
    $types_new=array();
    foreach ($_POST as $key => $value) {
        $types_new[]=$key;
        switch ($key) {
            case 'ScoreA':
                $new[$key]=(int)$value;
                break;
            case 'ScoreH':
                $new[$key]=(int)$value;
                break;
            case 'Ball':
                $new[$key]=(int)$value;
                break;
            case 'Strike':
                $new[$key]=(int)$value;
                break;
            case 'Out':
                $new[$key]=(int)$value;
                break;
            case 'Ining':
                $new[$key]=(int)$value;
                break;
            case 'bot':
                $new[$key]=(int)$value;
                break;
            case 'b1':
                $new[$key]=filter_var($value, FILTER_VALIDATE_BOOLEAN);
                break;
            case 'b2':
                $new[$key]=filter_var($value, FILTER_VALIDATE_BOOLEAN);
                break;
            case 'b3':
                $new[$key]=filter_var($value, FILTER_VALIDATE_BOOLEAN);
                break;
            default:
                $new[$key]=$value;
                break;
        }
    }
    foreach ($types as $key => $value) {
        if(in_array($value,$types_new)){
            $i++;
        }else{
            $missing[]=$value;
        }
    }
    if($i==14){
        $file = fopen("data.json", "w");
        if($file==false){
            echo('{"ok":false,"code":500,"result":"Unable to open file"}');
            http_response_code(500);
        }else{
            //comparing difference
            $diff=array_diff_assoc($new,$old);
            $diff=json_encode($diff,true);
            //Saving JSON
            fwrite($file, json_encode($new,JSON_PRETTY_PRINT));
            fclose($file);
            //oppening LOG
            $log=fopen("changes.log",'a');
            if($log==false){
                echo('{"ok":true,"code":200,"result":"changes done","changes":'.$diff.',"log":false}');
                http_response_code(200);
            }else{
                //Saving log
                $txt_log="[INFO] ".date("d-m-Y H:i:s")." chages done: ".$diff."\n";
                fwrite($log,$txt_log);
                fclose($log);
                echo('{"ok":true,"code":200,"result":"changes done","changes":'.$diff.',"log":true}');
                http_response_code(200);
            }
        }
    }else{
        echo('{"ok":false,"code":400,"result":"data is not correctly set","missing":"'.json_encode($missing,true).'"}');
        http_response_code(400);
    }
}else{
    echo('{"ok":false,"code":405,"result":"'.$_SERVER['REQUEST_METHOD'].' request not allowed"}');
    http_response_code(405);
}
?> 