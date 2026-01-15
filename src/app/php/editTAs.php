<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
require_once '.\dosimetristList.php';

$handle = connectDB_FL();
    $log = new LogFuncs();
    $log->logMessage("Received GET parameters: ". print_r($_GET, true));
    if (isset($_GET['vidx']) == false || isset($_GET['newValueName']) == false || isset($_GET['newValue']) == false){
       $log->logMessage("Missing parameters in editTAs.php");
       exit();
    }
   $oldValue = getSingle("SELECT ".$_GET['newValueName']." from vacation3 WHERE vidx = ".$_GET['vidx'], $_GET['newValueName'], $handle);
   $log->logMessage("Old value: ". print_r($oldValue, true));
   $updateSts = "UPDATE top(1) vacation3 SET ".$_GET['newValueName']." = '".$_GET['newValue']."' WHERE vidx = ".$_GET['vidx'];   
   $log->logSql($updateSts);
   if ($_GET['fromLink'] == '1'){                                                                     // go here from link in email
      if (strpos($_GET['newValueName'],'approved') !== false ){                                       // echo appropriate message
         echo "<br> Time Away Approved: <br>";
      }
      if (strpos($_GET['newValueName'],'allAccepted') !== false){
         echo "<br> Coverage Accepted <br>";
      }
      exit();
   }
   /*
   $GoAwayerUserKey = getSingle("SELECT userid from vacation3 WHERE vidx = ".$_GET['vidx'], "userid", $handle);
   $isDosimetrist = in_array($GoAwayerUserKey, $dosimetrist);
   $log->logMessage("isDosimetrist: ". ($isDosimetrist ? 'true' : 'false'));
   */

   exit(0);

 

