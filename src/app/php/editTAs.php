<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/editTA.txt", "a+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  "\r\n". $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $updateSts = "UPDATE top(1) vacation3 SET ".$_GET['newValueName']." = '".$_GET['newValue']."' WHERE vidx = ".$_GET['vidx'];
   fwrite($fp, "\r\n $updateSts");

   $stmt = sqlsrv_prepare($handle, $updateSts, array($_GET['vidx']));
   if ($stmt === false) {
       $dstr = print_r(sqlsrv_errors(), true);
       fwrite($fp, "\r\n errors: \r\n ".$dstr);
   }
   if (sqlsrv_execute($stmt) === false) {
       $dstr = print_r(sqlsrv_errors(), true);
       fwrite($fp, "\r\n errors: \r\n ".$dstr);
   }
   sqlsrv_free_stmt($stmt);
   sqlsrv_close($handle);
   echo json_encode(array("status"=>"success"));