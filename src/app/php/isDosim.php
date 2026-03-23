<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
require_once '.\dosimetristList.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
   if (in_array($_GET['userkey'], $dosimetrist)){
      $log->logMessage("Userkey: ".$_GET['userkey']." is a dosimetrist");
      $ret = array("isDosimetrist" => true);

   }
   else {
      $log->logMessage("Userkey: ".$_GET['userkey']." is NOT a dosimetrist");
      $ret = array("isDosimetrist" => false);
   }
   echo json_encode($ret)  ;
   exit();