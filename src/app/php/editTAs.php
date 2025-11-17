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
