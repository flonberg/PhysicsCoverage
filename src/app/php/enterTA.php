<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $now = date("Y-m-d h:i:s");
   $fp = fopen("./log/enterTA.txt", "w+");
	$time = date("Y-m-d H:i:s");
	fwrite($fp,  $time . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   if ($_GET['userid'] == ''){
    fwrite($fp, "\r\n No userid passed \r\n");
       if (isset($_SERVER['REMOTE_USER'])){
           $_GET['userid'] = $_SERVER['REMOTE_USER'];
           fwrite($fp, "\r\n Remote user is ".$_GET['userid']." \r\n");
        } else {
           fwrite($fp, "\r\n No remote user either \r\n");
           exit;    
   }
}
   $selStr = "SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."'";
        fwrite($fp, "\r\n $selStr \r\n");
    $UserKey = getSingle($selStr, 'UserKey', $handle);
   $selStr = "SELECT LastName, FirstName, rank, inst_id FROM physicists WHERE UserKey = ".$UserKey;
     fwrite($fp, "\r\n $selStr \r\n");
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false )
       { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }
   $temp = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
ob_start(); var_dump($temp);$data = ob_get_clean();fwrite($fp, "\r\n ". $data);

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