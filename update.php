<?php
$myfile = fopen("data.json", "w") or die("Unable to open file!");
$txt = $_POST[d];
fwrite($myfile, $txt);
fclose($myfile);
echo $_GET[d];
echo $_POST[d];
?> 