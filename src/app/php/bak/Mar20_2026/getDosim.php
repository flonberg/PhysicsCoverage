<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getDosims.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
$dosimetrist = array(44,45, 46, 105,121,47,52, 53, 62,56,76,106,164, 251,213,214, 58,158,60,61,104,261,234,  280,283, 287, 323, 324, 342, 344, 345, 
 357, 358, 382, 429, // added 342 Botticello 8-20-24
	448, 467, 470, 503, 507, 509, 494, 634, 641, 683, 715,716, 728, 729, 753,799,  838, 801,838, 888,893, 894,
	 948, 999, 919, 952, 997,999,1001,1007, 1027,1045, 1055);    
     $placeholders = implode(', ', array_fill(0, count($dosimetrist), '?'));
   $selStr = "SELECT LastName, FirstName, UserKey FROM physicists WHERE UserKey IN (52, 56,251, 261, 342,344, 345,382, 448, 467, 470, 503, 507, 509, 494, 634, 641, 683, 715,716,
         728, 729, 753,799,  838, 801,838, 888,893, 894,
	 948, 999, 919, 952, 997,999,1001,1007, 1027,1045, 1055, 116) ORDER BY LastName";// add myself to text cov accept request email  
   fwrite($fp, "\r\n $selStr");
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false )
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }
    $row = Array();
    $i = 0;
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
          $row[$i++]  = $temp;
         }
    $ret = json_encode($row);
    echo $ret;  