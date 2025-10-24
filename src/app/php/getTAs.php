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
$dosimetrist = array(44,45, 46, 58, 105,121,47,52, 53, 62,56,76,106,164, 251,213,214, 58,158,60,61,104,261,234,  280,283, 287, 323, 324, 342, 344, 345, 
 357, 358, 382, 429, // added 342 Botticello 8-20-24
	448, 467, 470, 503, 507, 509, 494, 634, 641, 683, 715,716, 728, 729, 753,799,  838, 801,838, 888,893, 894,
	 948, 999, 919, 952, 997,999,1001,1007, 1027,1045, 1055);    
    
  $selStr = "SELECT vacation3.startDate, vacation3.endDate, vacation3.userid, vacation3.vidx, vacation3.reason, vacation3.note,
      physicists.LastName,physicists.FirstName,
      users.UserID
      from vacation3
      INNER JOIN physicists ON physicists.UserKey = vacation3.userid
      INNER JOIN users ON users.UserKey = vacation3.userid
      where vacation3.endDate >= '".$_GET['startDate']."' AND vacation3.startDate < '".$_GET['endDate']."' AND vacation3.reasonIdx IS NULL
      order by physicists.LastName, vacation3.startDate ";
   fwrite($fp, "\r\n $selStr");
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false ) 
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); } 
    $row = Array();
    $i = 0;  
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      $dstr = print_r($temp, true); fwrite($fp, $dstr);
      if (in_array($_GET['loggedInUserKey'], $dosimetrist) && in_array($temp['userid'], $dosimetrist)) 
          $row[$i++]  = $temp;     
      else  if (!in_array($_GET['loggedInUserKey'], $dosimetrist) && !in_array($temp['userid'], $dosimetrist)) 
         $row[$i++]  = $temp;
   }
   $ret['tAs'] = $row;
   if (in_array($_GET['loggedInUserKey'], $dosimetrist))
       $ret['isDosimetrist'] = 1;
   else
       $ret['isDosimetrist'] = 0;
   $ret = json_encode($ret);
   echo $ret;

