<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
    $log->logMessage("Received GET parameters: ". print_r($_GET, true));
    $dat = getLastName($_GET['userkey'], $handle);
    $log->logMessage("Retrieved name data: ". print_r($dat, true));
    $ret = json_encode($dat);
    echo $ret;
   exit();

function getLastName($userkey, $handle){
    $selStr = "SELECT LastName, FirstName FROM physicists WHERE UserKey = ".$userkey;
    $stmt = sqlsrv_query( $handle, $selStr);
    if( $stmt === false ) 
        { return ""; } 
     $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
     return $temp;
}