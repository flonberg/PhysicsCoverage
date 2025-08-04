<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getMyDutiesLog.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);

 $selStr = "SELECT  PhysicsMonthlyDuty.idx,  PhysicsMonthlyDuty.serviceid, PhysicsMonthlyDuty.day, PhysicsMonthlyDuty.userkey,
  PhysicsMonthlyDuty.phys2, PhysicsDuty.Idx, PhysicsDuty.timeSpan, PhysicsDuty.name
  FROM PhysicsMonthlyDuty
  JOIN PhysicsDuty ON PhysicsDuty.Idx=PhysicsMonthlyDuty.serviceid
   WHERE day > '".$_GET['Start']."'
  AND (userkey = ".$_GET['userkey']." OR phys2 = ".$_GET['userkey']." OR phys3 = ".$_GET['userkey'].") 
  ORDER BY day";
   fwrite($fp, "\r\n $selStr");

   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
    $row = Array();
    $i = 0;  
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      $dstr = print_r($temp, true); fwrite($fp, $dstr);
      $test = strlen($temp['phys2']);
      ob_start(); var_dump($test);$data = ob_get_clean();fwrite($fp, "\r\n ". $data);
         if ($temp['userkey'] == $_GET['userkey'] && strlen($temp['phys2'] == 0)){
            fwrite($fp, "\r\n 3030 add \r\n");
            $row[$i++]  = $temp;
         }
         if ($temp['phys2'] == $_GET['userkey']){
                        fwrite($fp, "\r\n 3434 add \r\n");
          $row[$i++]  = $temp;
         }
     
      }

   if ($_GET['debug'] == '1')
     { $dstr = print_r($row, true); fwrite($fp, $dstr);}
   $ret = json_encode($row);
   echo $ret;

