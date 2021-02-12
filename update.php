<?php
if($_SERVER['REQUEST_METHOD']==='POST'){
    if(isset($_POST['d'])){
        $old1=file_get_contents("./data.json");
        $old=json_decode($old1, true);
        //Saving array types required
        $types=array();
        foreach ($old as $key => $value) {
            $types[]=$key;
        }
        $file = fopen("data.json", "w");
        if($file==false){
            echo('{"ok":false,"code":500,"result":"Unable to open file"}');
            http_response_code(500);
        }else{
            $new=json_decode($_POST['d'],true);
            //Checking passed items
            $i=0;
            $missing=array();
            $types_new=array();
            foreach ($new as $key => $value) {
                $types_new[]=$key;
            }
            foreach ($types as $key => $value) {
                if(in_array($value,$types_new)){
                    $i++;
                }else{
                    $missing[]=$value;
                }
            }
            //I check if they are all present
            if($i==14){
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
            }else{
                $missing_txt=json_encode($missing,true);
                echo('{"ok":false,"code":400,"result":"d is not correctly set","missiing":"'.$missing_txt.'"}');
                http_response_code(400);
                fwrite($file,$old1);
                fclose($file);
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