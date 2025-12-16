<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
Require_once '.\dosimetristList.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
   if ($_GET['userkey'] == '' || $_GET['userkey'] == 0){
      $log->logMessage("No userkey passed");
      exit;
   }
   $isDosimetrist = in_array($_GET['userkey'], $dosimetrist);
   $log->logMessage("isDosimetrist: ". ($isDosimetrist ? 'true' : 'false'));
   if ($isDosimetrist == true){
      $covererData = getCovererData($_GET['coverer']);
      $log->logMessage("Coverer data: ". print_r($covererData, true));
      } 
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
   $insStr = "INSERT INTO vacation3 (startDate, endDate, reason, userid, coverageA, note, createWhen)
     VALUES ('".$_GET['startDate']."', '".$_GET['endDate']."', ".$_GET['reason'].", '".$UserKey."', ".$_GET['coverer'].",  '".$_GET['note']."', '".$now."'); SELECT SCOPE_IDENTITY() AS idx, 'Inserted TA for ".$goAwayerData['FirstName']." ".$goAwayerData['LastName']."' AS data;";
   $log->logMessage("Executing insert: ".$insStr);
   $stmt = sqlsrv_query( $handle, $insStr);
   if( $stmt === false )
      $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true)); 
   // Move to the next result and display results.
$next_result = sqlsrv_next_result($stmt);
if( $next_result ) {
   while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)){
      $lastInsertedIdx = $row['idx'];
      $log->logMessage($row['idx'].": ".$row['data']."<br />");
   }
} elseif( is_null($next_result)) {
     $log->logMessage("No more results.<br />");
} 
 if ($isDosimetrist == false){
   $log->logMessage("No email notification forneeded TA entered by non-dosimetrist userkey: ".$UserKey);
 }
   else { 
      sendEmailtoBrianAndCoverer($goAwayerData, $covererData, $lastInsertedIdx);
   }
   exit();
   function getCovererData($covererUserKey){
      global $log;
      $handle = connectDB_FL();
      $selStr = "SELECT LastName, FirstName, Email FROM physicists WHERE UserKey = ".$covererUserKey;
      $log->logMessage("Executing query: ".$selStr);
      $stmt = sqlsrv_query( $handle, $selStr);
      if( $stmt === false )
         $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true));
      $covererData = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
      $log->logMessage("Coverer data: ". print_r($covererData, true));
      return $covererData;
   }
   function sendEmailtoBrianAndCoverer($goAwayerData, $covererData, $lastInsertedIdx){
      global $log;
      $approverEmail = 'bnapolitano@partners.org';
      $approverEmail = "flonberg@mgh.harvard.edu";
      $goAwayer['Email'] = "flonberg@mgh.harvard.edu";
      $link = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$lastInsertedIdx."&newValueName=approved&newValue=1&debug=1";
      $link2 = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$lastInsertedIdx."&newValueName=coverageA&newValue=".$covererData['UserKey']."&debug=1";
         $subject = 'Time Away Entered for '.$goAwayerData['FirstName'].' '.$goAwayerData['LastName'] ." needs approval";			
         $headers = 'From: whiteboard@partners.org'. "\r\n";
         $headers .= 'Reply-To: whiteboard@partners.org'. "\r\n";
         $headers .= 'Bcc: flonberg@mgh.harvard.edu'. "\r\n";
         $headers .= 'MIME-Version: 1.0'. "\r\n";
         $headers .= 'Content-Type: text/html; charset=ISO-8859-1'. "\r\n";
         $message =  '<html>';
         $message .= '<head>';
         $message .= '<style>.attention{font-size: large; padding:10;} .bigAttention{font-size: x-large;}</style>';
         $message .= '</head>';
         $message .= '<body>';
         $message1 = 'Brian.<br><br>';
         $message1 .= '<p> ' . $goAwayerData['FirstName'].' '.$goAwayerData['LastName']." has entered a Time Away  for ".$_GET['startDate'] ." to ". $_GET['endDate']." which needs approval.</p>";
         $message1 .= "<p> To approve this Time Away, click here <a href='".$link."'>Approve Time Away </a> or go to the Time Away page on the Physics Coverage Whiteboard. </p>";
         $message1 .= '</body></html>'; 
         $message2 = $covererData['FirstName'].' '.$covererData['LastName'].'<br><br>';
         $message2 .= '<p> ' . $goAwayerData['FirstName'].' '.$goAwayerData['LastName']." has nominated you to cover a Time Away from ".$_GET['startDate'] ." to ". $_GET['endDate']." .</p>";
         $message2 .= "<p> To accept coverage for this Time Away, click here <a href='".$link2."'>Accept Coverage </a> . </p>";
         $message2 .= '</body></html>'; 
      $log->logMessage("6565 Preparing to send email notification for go awayer: ". print_r($goAwayerData, true));
//Send Email
      $wholeMessage = $message . $message1;
      /*
      if (mail($approverEmail,$subject, $wholeMessage, $headers)) 
        $log->logMessage("Email successfully sent to ".$goAwayerData['Email']);
     else 
        $log->logMessage("Email sending failed to ".$goAwayerData['Email']);
      $wholeMessage = $message . $message2;
      if (mail($goAwayerData['Email'],$subject, $wholeMessage, $headers)) 
        $log->logMessage("Email successfully sent to ".$goAwayerData['Email']);
      else 
        $log->logMessage("Email sending failed to ".$goAwayerData['Email']);
*/
   }