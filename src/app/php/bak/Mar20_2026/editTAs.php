<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';

$handle = connectDB_FL();
    $log = new LogFuncs();
    $log->logMessage("Received GET parameters: ". print_r($_GET, true));
    if (isset($_GET['vidx']) == false || isset($_GET['newValueName']) == false || isset($_GET['newValue']) == false){
       $log->logMessage("Missing parameters in editTAs.php");
       exit();
    }
   $updateSts = "UPDATE top(1) vacation3 SET ".$_GET['newValueName']." = '".$_GET['newValue']."' WHERE vidx = ".$_GET['vidx'];   
   $log->logSql($updateSts);
   if (strpos($_GET['newValueName'],'approved') !== false){
      echo "<br> Time Away Approved: <br>";
   }
   if (strpos($_GET['newValueName'],'allAccepted') !== false){
      echo "<br> Coverage Accepted <br>";
   }
