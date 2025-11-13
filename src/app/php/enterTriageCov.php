<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
    $log = new LogFuncs();

   $log->logMessage("Script started");
   $now = date("Y-m-d h:i:s");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
 
   if ($_GET['userkey'] == '')
   {
      fwrite($fp, "\r\n No userkey passed \r\n");
      exit;    
   }
   $insStr = "INSERT INTO ResidentTriageDuty (userkey, day, modWhen) VALUES (".$_GET['userkey'].", '".$_GET['date']."', '".$now."')";
   fwrite($fp, "\r\n $insStr");
   $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
   else
       { fwrite($fp, "\r\n Inserted successfully \r\n"); }
   sqlsrv_free_stmt( $stmt);
   sqlsrv_close( $handle);
   fclose($fp);   