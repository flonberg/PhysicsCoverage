<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
   $ret=array();                                         // for returning result to caller
   $log = new LogFuncs();
   $log->logMessage("Get has ".print_r($_GET, true));
   $userkey = $_GET['userkey'];
   if ($userkey == '' || $userkey == '0' || !is_numeric($userkey)){
      $log->logMessage("No userkey passed or not numeric");
      $ret['result']  = 'failed' ;
      echo json_encode($ret);
      exit();
   }
   $updateStr = "UPDATE TOP(1) PhysicsMonthlyDuty SET phys2 = ". $_GET['userkey'].", modWhen = GETDATE() WHERE idx = ".$_GET['idx'];
   $log->logMessage("Executing query: $updateStr");
   $stmt = sqlsrv_query( $handle, $updateStr);
   if( $stmt === false ) {
        $dstr = ( print_r( sqlsrv_errors(), true));
        $log->logMessage("Error: $dstr");
        $ret['result']  = 'failed' ;
      } 
   else {
      $log->logMessage("Update successful");
      $selStr = "SELECT LastName FROM physicists WHERE UserKey = ".$userkey;
      $subLastName = getSingle($selStr, 'LastName',$handle);
      $ret['newUserKey']  = $userkey;
      $ret['neweLastName'] = $subLastName;
      $ret['idx'] = $_GET['idx'];
   }
   echo json_encode($ret);