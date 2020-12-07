<?php
if(isset($_POST[d])){
    $myfile = fopen("data.json", "w") or die("Unable to open file!");
    $txt = $_POST[d];
    fwrite($myfile, $txt);
    fclose($myfile);
    echo $_POST[d];
}
?> 