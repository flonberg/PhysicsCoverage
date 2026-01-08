<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
require_once '.\dosimetristList.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
	fwrite($fp,  "\r\n". $time . "\n");
   $selStr = "SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."'";
   $userkeyString = getSingle($selStr, 'UserKey', $handle);
   $isDosimetrist = in_array($userkeyString, $dosimetrist);
   $userkey = (int)$userkeyString;
   $selStr = "SELECT LastName FROM physicists WHERE UserKey = '".$userkey."'";
   $lastName = getSingle($selStr, 'LastName', $handle);
   if ($lastName === null){
         $selStr = "SELECT LastName FROM physicians WHERE UserKey = '".$userkey."'";
         $lastName = getSingle($selStr, 'LastName', $handle);
   }
   $ret = Array();
   $ret['userkey'] = $userkey;
   $ret['lastName'] = $lastName;
   $ret['isDosimetrist'] = $isDosimetrist;
   echo json_encode($ret);
 