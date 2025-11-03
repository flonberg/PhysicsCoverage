<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getTriageCoverers.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
    
  $selStr = "SELECT FirstName, LastName, UserKey,Email from physicians
    WHERE Rank = 3 Order by LastName";
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
   $ret['TCs'] = $row;
   $ret = json_encode($ret);
   echo $ret;

