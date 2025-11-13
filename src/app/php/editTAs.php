<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
    $log = new LogFuncs();

   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $log->logMessage("Received GET parameters: ". $dstr);
   $updateSts = "UPDATE top(1) vacation3 SET ".$_GET['newValueName']." = '".$_GET['newValue']."' WHERE vidx = ".$_GET['vidx'];    $log->logSql($updateSts);
    $log->logSql($updateSts);
 /*
   $stmt = sqlsrv_prepare($handle, $updateSts); 
   if ($stmt === false) {
       $dstr = print_r(sqlsrv_errors(), true);
       $log->logMessage("Error preparing statement: ". $dstr);
   }
   if (sqlsrv_execute($stmt) === false) {
       $dstr = print_r(sqlsrv_errors(), true);
       $log->logMessage("Error executing statement: ". $dstr);
   }
   else {
       $log->logMessage($updateSts);
   } 
   */   
  // sqlsrv_free_stmt($stmt);
  // sqlsrv_close($handle);
   echo json_encode(array("status"=>"success"));