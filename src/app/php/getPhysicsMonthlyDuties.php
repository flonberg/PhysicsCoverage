<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
require_once 'H:\inetpub\lib\LogFuncs.php';
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));

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
   WHERE day >= '2025-12-01'
    ORDER BY day, serviceid";
   $log->logMessage("SQL Query: ". $selStr);
      $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
    $row = Array();
    $i = 0;  
    while( $row[$i] = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      if (!empty($row[$i]['phys2']) && $row[$i]['phys2'] > 0 ){                     // plug in Phys2 if NOT NULL
         $log->logMessage("Found phys2 for duty idx ".print_r($row[$i]['idx'], true)." : phys2 userkey ".print_r($row[$i]['phys2'], true));
         $row[$i]['userkey'] = $row[$i]['phys2'];
         $selStr = "SELECT LastName FROM physicists WHERE UserKey = ".$row[$i]['phys2'];
         $subLastName = getSingle($selStr, 'LastName',$handle);
         $row[$i]['LastName'] = $subLastName;
      }
      $i++;
    }

   $log->logMessage("Fetched Duties: ". print_r($row[0], true));
   $ret = json_encode($row);
   echo $ret;

