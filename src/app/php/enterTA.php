<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
    $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". $dstr);
   if ($_GET['userid'] == ''){
    $log->logMessage("No userid passed");
       if (isset($_SERVER['REMOTE_USER'])){
           $_GET['userid'] = $_SERVER['REMOTE_USER'];
           $log->logMessage("Remote user is ".$_GET['userid']);
           $log->logMessage("No remote user either");
        } else {
           $log->logMessage("No remote user either");
           exit;
   }
}
   $selStr = "SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."'";
   $log->logMessage("Executing query: ".$selStr);
    $UserKey = getSingle($selStr, 'UserKey', $handle);
    if ($UserKey == ''){
       $log->logMessage("No UserKey found for userid ".$_GET['userid']);
       exit;
    }
   $selStr = "SELECT LastName, FirstName, rank, inst_id FROM physicists WHERE UserKey = ".$UserKey;
   $log->logMessage("Executing query: ".$selStr);
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false )
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }
   $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);


    fwrite($fp, "\r\n userLastName: $userLastName  UsreId is $UserKey \r\n");
    $insStr = "INSERT INTO vacation3 (startDate, endDate, reason, userid, createWhen)
     VALUES ('".$_GET['startDate']."', '".$_GET['endDate']."', ".$_GET['reason'].", '".$UserKey."', '".$now."')";
    fwrite($fp, "\r\n $insStr \r\n");
       $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false )
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }

   	$goAwayerLastName = getSingle("SELECT LastName FROM physicists WHERE UserKey = $userkey", "LastName", $handle);

 //  $mailAddress = "bnapolitano@partners.org";
   $mailAddress = 'flonberg@partners.org';
//	$mailAddress = "flonberg@partners.org";					////// changed on 6-24-2016   \\\\\\\\\\\
	$subj = "Vacation Approval";
	$msg =    "Brian: <br>There is a vacation for $goAwayerLastName which needs you approval. ";
	if ($_GET['n'] == 1){
		$subj = "Vacation Change";
		$msg =    "Brian: <br>The dates for $goAwayerLastName time-away have been changed. ";
	}
	if ($_GET['n'] == 2){
		$msg =    "Brian: <br>The time-away for $goAwayerLastName has been deleted. ";
		$subj = "Vacation Deleted";
	}
	$message = '
       			 <html>
       			 <head>
       			 <title> Time Away Approval </title>
       			 <body>
       			 <p>
       			 '. $msg .'
       			 </p>
			<p>
       			  <a href='.$link .'> Time away schedule. </a>
			</body>
			</html>
			'; 

	$headers = 'MIME-Version: 1.0' . "\r\n";
       	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
       	$headers .= 'From: Whiteboard'. "\r\n";
        $headers .= 'Cc: flonberg@partners.org'. "\r\n";
       	$res = mail ( $mailAddress, $subj, $message, $headers);