<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();

   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getPhysicsDutiesLog.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $selStr = "SELECT PhysicsMonthlyDuty.idx, PhysicsMonthlyDuty.serviceid, PhysicsMonthlyDuty.day, 
   PhysicsMonthlyDuty.userkey, PhysicsMonthlyDuty.phys2, PhysicsMonthlyDuty.phys3,
   physicists.LastName, physicists.UserKey, physicists.Email
   FROM PhysicsMonthlyDuty 
   INNER JOIN physicists ON physicists.UserKey = PhysicsMonthlyDuty.userkey
   WHERE day LIKE '".$_GET['MonthNum']."%'
    ORDER BY day, serviceid";
   $selStr = "SELECT PhysicsMonthlyDuty.idx, PhysicsMonthlyDuty.serviceid, PhysicsMonthlyDuty.day, 
      PhysicsMonthlyDuty.userkey, PhysicsMonthlyDuty.phys2, PhysicsMonthlyDuty.phys3,
      physicists.LastName, physicists.UserKey, physicists.Email
      FROM PhysicsMonthlyDuty 
      INNER JOIN physicists ON physicists.UserKey = PhysicsMonthlyDuty.userkey
     
    ORDER BY day, serviceid";
   fwrite($fp, "\r\n $selStr");
      $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
    $row = Array();
    $i = 0;  
    while( $row[$i] = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      if (!empty($row[$i]['phys2']) && $row[$i]['phys2'] > 0 ){                     // plug in Phys2 if NOT NULL
     //    fwrite($fp, "\r\n plug in -- ". $row[$i]['phys2'] ." for ". $row[$i]['userkey']." in idx ".$row[$i]['idx']);
         $row[$i]['userkey'] = $row[$i]['phys2'];
         $selStr = "SELECT LastName FROM physicists WHERE UserKey = ".$row[$i]['phys2'];
         $subLastName = getSingle($selStr, 'LastName',$handle);
         $row[$i]['LastName'] = $subLastName;
      }
      $i++;
    }

   if ($_GET['debug'] == '1')
      $dstr = print_r($row, true); fwrite($fp, $dstr);
   $ret = json_encode($row);
   echo $ret;

