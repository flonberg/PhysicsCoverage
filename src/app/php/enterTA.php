<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/enterTA.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   if ($_GET['userid'] == '')
        $_GET['userid'] = 'fjl3';
   $selStr = "SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."'";
        fwrite($fp, "\r\n $selStr \r\n");
    $UserKey = getSingle($selStr, 'UserKey', $handle);
   $selStr = "SELECT LastName, FirstName, rank, inst_id FROM physicists WHERE UserKey = ".$UserKey;
     fwrite($fp, "\r\n $selStr \r\n");
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false )
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }
   $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
ob_start(); var_dump($temp);$data = ob_get_clean();fwrite($fp, "\r\n ". $data);

    fwrite($fp, "\r\n userLastName: $userLastName  UsreId is $UserKey \r\n");
    $insStr = "INSERT INTO vacation3 (startDate, endDate, reason, userid, createWhen) VALUES ('".$_GET['startDate']."', '".$_GET['endDate']."', ".$_GET['reason'].", '".$UserKey."', '".$now."')";
    fwrite($fp, "\r\n $insStr \r\n");
       $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false )
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }