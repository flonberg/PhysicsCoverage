<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
   if ($_GET['debug'] == 1){
       echo "<pre> Received GET parameters: ". print_r($_GET, true)."</pre>";
   }
   if ($_GET['userkey'] == '' || $_GET['userkey'] == 0){
      $log->logMessage("No userkey passed");
      exit;
   }
   $isDosimetrist = in_array($_GET['userkey'], $dosimetrist);
   $UserKey = $_GET['userkey'];
   $selStr = "SELECT LastName, FirstName, rank, inst_id FROM physicists WHERE UserKey = ".$UserKey;
   $log->logMessage("Executing query: ".$selStr);
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false )
      $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true));
   $goAwayerData = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
   $log->logMessage("Go awayer data: ". print_r($goAwayerData, true));
   if ($_GET['reason'] == ''){
       $_GET['reason'] = 3;   // other
   }
   $now = date("Y-m-d h:i:s");
   $insStr = "INSERT INTO vacation3 (startDate, endDate, reason, userid, coverageA, createWhen)
     VALUES ('".$_GET['startDate']."', '".$_GET['endDate']."', ".$_GET['reason'].", '".$UserKey."', ".$_GET['coverer'].", '".$now."')";
   $log->logMessage("Executing insert: ".$insStr);
       $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false )
      $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true)); 
   $goAwayerLastName = getSingle("SELECT LastName FROM physicists WHERE UserKey = $userkey", "LastName", $handle);
 if ($isDosimetrist == false){
   $log->logMessage("No email notification forneeded TA entered by non-dosimetrist userkey: ".$UserKey);
 }
   else{ 
      sendEmailtoBrianAndCoverer($goAwayerData);
   }
   exit();
   function sendEmailtoBrianAndCoverer($goAwayerData){
      $link = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/dist10/physics-coverage/browser/userid=napolitano";
      $mailAddress = 'flonberg@partners.org';
   //	$mailAddress = "flonberg@partners.org";					////// changed on 6-24-2016   \\\\\\\\\\\
      $subj = "Vacation Approval";
      $msg =    "Brian: <br>There is a vacation for ". $goAwayerData['FirstName'] ." ". $goAwayerData['LastName'] ."which needs you approval. ";
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
   }