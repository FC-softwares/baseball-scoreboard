<?php
if(isset($_POST['d'])){
    $file = fopen("data.json", "w");
    if($file==false){
        echo('{"ok":false,"code":500,"result":"Unable to open file"}');
        http_response_code(500);
    }else{
        $txt = $_POST['d'];
        fwrite($file, $txt);
        fclose($file);
        echo('{"ok":true,"code":200,"result":"changes done"}');
        http_response_code(200);
    }
}else{
    echo('{"ok":false,"code":400,"result":"d for data set is not set"}');
    http_response_code(400);
}
?> 