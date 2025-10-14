<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/enterTA.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $userLastName = getSingle("SELECT LastName FROM physicists WHERE UserKey = ".$_GET['userkey'], 'LastName', $handle);
    fwrite($fp, "\r\n userLastName: $userLastName \r\n");
   $insStr = "INSERT INTO TimeAway (StartDate, EndDate, Reason, Coverer, UserKey, EnteredBy, EnteredOn) VALUES (?,?,?,?,?,?,?)";