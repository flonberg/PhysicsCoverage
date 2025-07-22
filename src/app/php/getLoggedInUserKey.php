<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/getLoggedInUserKeyLog.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  "\r\n". $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   $selStr = "SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."'";
   $userkeyString = getSingle($selStr, 'UserKey', $handle);

   $userkey = (int)$userkeyString;
   $selStr = "SELECT LastName FROM physicists WHERE UserKey = '".$userkey."'";
   $lastName = getSingle($selStr, 'LastName', $handle);
   $ret = Array();
   $ret['userkey'] = $userkey;
   $ret['lastName'] = $lastName;
   echo json_encode($ret);
 