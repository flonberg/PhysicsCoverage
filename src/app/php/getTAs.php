<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getTAs.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $today = new DateTime();
   $Start = $today->format("Y-m-d");

  $selStr = "SELECT vacation3.startDate, vacation3.endDate, vacation3.userid, vacation3.vidx, vacation3.reasonIdx,
physicists.LastName
 from vacation3
 INNER JOIN physicists ON physicists.UserKey = vacation3.userid
where vacation3.endDate > '2025-10-07' AND vacation3.startDate < '".$_GET['endDate']."' AND vacation3.reasonIdx IS NULL
 order by vidx desc
   ";
   fwrite($fp, "\r\n $selStr");
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
    $row = Array();
    $i = 0;  
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      $dstr = print_r($temp, true); fwrite($fp, $dstr);
          $row[$i++]  = $temp;
         }
   $ret = json_encode($row);
   echo $ret;

