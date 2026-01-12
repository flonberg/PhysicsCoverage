<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
require_once '.\dosimetristList.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
   // $isDosimetrist = in_array($_GET['loggedInUserKey'], $dosimetrist);
   $today = new DateTime();
   $Start = $today->format("Y-m-d");
    
  $selStr = "SELECT vacation3.startDate, vacation3.endDate, vacation3.userid, vacation3.vidx, vacation3.reason, vacation3.note,
        vacation3.coverageA,vacation3.approved,vacation3.allAccepted,
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
    $loggedInUserKey = getSingle("SELECT UserKey from users where UserID = '".$_GET['loggedInUserId']."'", "UserKey", $handle);
    $log->logMessage("loggedInUserKey: ". print_r($loggedInUserKey, true)); 
    $isDosimetrist = in_array( $loggedInUserKey, $dosimetrist);
    ob_start(); var_dump($isDosimetrist);$data = ob_get_clean();fwrite($fp, "\r\n ". $data); $log->logMessage("isDosimetrist: ". print_r($data, true));   
    while( $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
        if (strpos($temp['LastName'], 'Liu') !== false)                             // Add OR for other common last names
            $temp['LastName'] = $temp['LastName'].", ".$temp['FirstName'];
        if ($_GET['which']== 0) {                                               // the Show Physicsists button was NOt clicked                 
            if ($isDosimetrist && in_array($temp['userid'], $dosimetrist))              // if user is dosimetrist, show only dosimetrists
                $row[$i++]  = $temp;  
            else  if (!$isDosimetrist && !in_array($temp['userid'], $dosimetrist)) // !mm
                $row[$i++]  = $temp;
        }
        if ($_GET['which'] == 1) {                                               // the Show Dosimetrists button was clicked                 
            if (in_array($temp['userid'], $dosimetrist))                        // show only physicists
                $row[$i++]  = $temp;
        }
        if ($_GET['which'] == 2) {                                               // the Show Dosimetrists button was clicked                 
            if (!in_array($temp['userid'], $dosimetrist))                       // show only physicists
                $row[$i++]  = $temp;
        }
   }
   $ret['tAs'] = $row;
   if ($isDosimetrist)
       $ret['isDosimetrist'] = 1;
   else
       $ret['isDosimetrist'] = 0;
    if (strpos($_GET['loggedInUserId'],'napolitano') !== false)                                 // put in the UserId of person in charge of approvals
        $ret['isApprover'] = true;  
     $log->logMessage("Returning parameters: ". print_r($ret['isDosimetrist'], true));
   $ret = json_encode($ret);
  
   echo $ret;
   exit();
   

