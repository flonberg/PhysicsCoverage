<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';  
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
    $log = new LogFuncs();
   $log->logMessage("Script started at ".$now." with parameters: ". print_r($_GET, true));
   if ($_GET['userkey'] == '' || $_GET['userkey'] == 0)
   {
      $log->logMessage("No userkey passed");
      exit;    
   }
   $insStr = "INSERT INTO ResidentTriageDuty (userkey, day, serviceid, modWhen)                                        
         VALUES (".$_GET['userkey'].", '".$_GET['date']."', '".$_GET['serviceid']."', 'GETDATE()')";                 // enter the serviceid in the GET dS
   $log->logMessage("Executing insert: ".$insStr);
   $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false ) 
       { $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true)); } 
   else
       { $log->logMessage("Inserted successfully    "); }
    if ($_GET['serviceid'] == '1')    {                                                                               // if triage duty is AM coverer, check if there is already an PM coverer
       if (isThereAPMCoverer($handle, $_GET['date'])){                                                                  // if there is already an APM coverer for that date, exit       {
           $log->logMessage("There is already an APM coverer for date ".$_GET['date']);
           exit();
       }
       else{
           $insStr = "INSERT INTO ResidentTriageDuty (userkey, day, serviceid, modWhen, modWho)                                                              
                VALUES (".$_GET['userkey'].", '".$_GET['date']."', '2', 'GETDATE()','".$_GET['userid']."' )";        // make INSERT statement to enter APM coverer too  
            $log->logSql($insStr);
       }
   }
   sqlsrv_free_stmt( $stmt);
   sqlsrv_close( $handle);
   fclose($fp); 
   exit();
   function isThereAPMCoverer($handle, $date)
   {
    global $log;
       $selStr = "SELECT COUNT(*) AS cnt FROM ResidentTriageDuty WHERE serviceid = '2' AND day = '".$date."'"; 
       $stmt = sqlsrv_query( $handle, $selStr);
       if( $stmt === false ) 
        { $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true)); } 
       $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
       sqlsrv_free_stmt( $stmt);
       if ($row['cnt'] > 0)
           return true;
       else
           return false;
   }