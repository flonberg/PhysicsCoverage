<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $ret=array();                                         // for returning result to caller
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/takeDutyLog.txt", "a+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp, "\r\n \r\n". $time . "\n");
 
   $userkey = $_GET['userkey'];
   $updateStr = "UPDATE TOP(1) PhysicsMonthlyDuty SET phys2 = ". $_GET['userkey'].", modWhen = GETDATE() WHERE idx = ".$_GET['idx'];
   fwrite($fp, "\r\n $updateStr");
   $stmt = sqlsrv_query( $handle, $updateStr);
   if( $stmt === false ) {
        $dstr = ( print_r( sqlsrv_errors(), true));
        fwrite($fp, "\r\n errors: \r\n ".$dstr); 
        $ret['result']  = 'failed' ;
      } 
   else {
      $selStr = "SELECT LastName FROM physicists WHERE UserKey = ".$userkey;
      $subLastName = getSingle($selStr, 'LastName',$handle);
      $ret['newUserKey']  = $userkey;
      $ret['neweLastName'] = $subLastName;
      $ret['idx'] = $_GET['idx'];
   }
   echo json_encode($ret);