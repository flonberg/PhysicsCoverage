<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
    /** get Coverers  */
  $selStr = "SELECT FirstName, LastName, UserKey,Email from physicians
    WHERE Rank = 3 Order by LastName";
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
    $row = Array();
    $byUserKey = Array();
    $i = 0;  
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
        $dstr = print_r($temp, true); fwrite($fp, $dstr);
        $row[$i++]  = $temp;
        $byUserKey[$temp['UserKey']] = $temp;
    }
   $ret['TCs'] = $row;
   $ret['byUserKey'] = $byUserKey;
   /** get Assignments  */
   $selStr = "SELECT ResidentTriageDuty.day, ResidentTriageDuty.userkey, ResidentTriageDuty.phys2, ResidentTriageDuty.phys3, ResidentTriageDuty.serviceid, physicians.LastName, physicians.FirstName 
      from ResidentTriageDuty
      JOIN physicians ON ResidentTriageDuty.userkey = physicians.UserKey
      where del = 0 AND ResidentTriageDuty.day >= '".$_GET['startDate']."' AND ResidentTriageDuty.day <= '".$_GET['endDate']."'
      ORDER BY ResidentTriageDuty.idx desc";
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); $log->logMessage("SQL errors: ". $dstr); } 
    $row = Array();
    $i = 0;  
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
        $log->logMessage("Fetched assignment: ". print_r($temp, true));
        $row[$i++]  = $temp;
    }
   $ret['Duties'] = $row;  
   $ret = json_encode($ret);
   echo $ret;

