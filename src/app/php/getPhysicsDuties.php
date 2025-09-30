<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getPhysicsDutyLog.txt", "a+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  "\r\n". $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $selStr = "SELECT Idx, name, timeSpan,nomOrder,CalNum, role, fixed FROM PhysicsDuty WHERE Idx IN (20,21,10,22,25)";
   if ($_GET['newDuties'] == 1)
      $selStr = "SELECT Idx, name, timeSpan,nomOrder,CalNum, role, fixed FROM PhysicsDuty WHERE Idx >=28 ";
   fwrite($fp, "\r\n $selStr");
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) {
        $dstr = ( print_r( sqlsrv_errors(), true));
        fwrite($fp, "\r\n errors: \r\n ".$dstr); 
      } 
    $row = Array();
    $i = 0;  
    while( $row[$i++] = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {}
//   if ($_GET['debug'] == '1')
      $dstr = print_r($row, true); fwrite($fp, $dstr);
   $ret = json_encode($row);
   echo $ret;
 