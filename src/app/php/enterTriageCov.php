<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Script started");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   if ($_GET['userkey'] == '')
   {
      fwrite($fp, "\r\n No userkey passed \r\n");
      exit;    
   }
   $log->logMessage(print_r($_GET, true));
   $insStr = "INSERT INTO ResidentTriageDuty (userkey, day, modWhen) VALUES (".$_GET['userkey'].", '".$_GET['date']."', '".$now."')";
   $log->logMessage("\r\n $insStr");
   $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false ) 
       { $log->logMessage( print_r( sqlsrv_errors(), true)); } 
   else
       { $log->logMessage("\r\n Inserted successfully \r\n"); }
   sqlsrv_free_stmt( $stmt);
   sqlsrv_close( $handle);
   fclose($fp);   