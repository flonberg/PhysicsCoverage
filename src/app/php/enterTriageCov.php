<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';  
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
    $log = new LogFuncs();
   $now = date("Y-m-d h:i:s");
   $log->logMessage("Current time: ".$now);
   $log->logMessage("Script started at ".$now." with parameters: ". print_r($_GET, true));
   if ($_GET['userkey'] == '' || $_GET['userkey'] == 0)
   {
      $log->logMessage("No userkey passed");
      exit;    
   }
   $insStr = "INSERT INTO ResidentTriageDuty (userkey, day, serviceid, modWhen) VALUES (".$_GET['userkey'].", '".$_GET['date']."', '".$_GET['serviceid']."', '".$now."')";
   $log->logMessage("Executing insert: ".$insStr);

   $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false ) 
       { $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true)); } 
   else
       { $log->logMessage("Inserted successfully    "); }
   sqlsrv_free_stmt( $stmt);
   sqlsrv_close( $handle);
   fclose($fp);   