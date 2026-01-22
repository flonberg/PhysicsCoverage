<?php
/** Lines thru 25 written by CoPilot */
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
require_once '.\dosimetristList.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $log->logMessage("Received GET parameters: ". print_r($_GET, true));
   if ($_GET['taidx'] == '' || $_GET['taidx'] == 0){
      $log->logMessage("No taidx passed");
      exit;
   }
   $selStr = "SELECT v.startDate, v.endDate, v.vidx, p.LastName, p.FirstName, p.Email
              FROM vacation3 v
              JOIN physicists p ON v.userid = p.UserKey
              WHERE v.vidx = ".$_GET['taidx'];
   $log->logMessage("Executing query: ".$selStr);
   $stmt = sqlsrv_query( $handle, $selStr);
   if( $stmt === false )
      $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true));
   $taData = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
   $log->logMessage("TA data: ". print_r($taData, true));
   sendUpdateEmailtoBrianAndGoAwayer($taData, $_GET['taidx']);
   //sendUpdateEmailtoBrianAndGoAwayer($taData, $_GET['taidx']);
   exit();
   function sendUpdateEmailtoBrianAndGoAwayer($taData, $taidx){
      global $log;
      $log->logMessage("Preparing to send update email for TA idx: ".$taidx);
      $link = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$taData['vidx']."&newValueName=approved&newValue=1&debug=1";
      $to = 'bnapolitano@partners.org';
      $to = "flonberg@mgh.harvard.edu";     
      $subject = "Time Away Update";
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
      $message .= "The Time Away for ".$taData['FirstName']." ".$taData['LastName']." has been updated:\n\n";
      $sdStr = $taData['startDate']->format('Y-m-d');
      $message .= "Start Date is now: ".$taData['startDate']->format('Y-m-d')."\n";
      $message .= "End Date is now: ".$taData['endDate']->format('Y-m-d')."\n";
      $message .= "<p>To approve this Time Away, click here <a href='".$link."'>Approve Time Away </a> or go to the Time Away page on the Physics Coverage Whiteboard. </p>";
      $message .= '</body></html>';
      $log->logMessage("Sending email to: ".$to);
      $res = mail($to, $subject, $message, $headers);
      ob_start(); var_dump($res);$data = ob_get_clean();$log->logMessage("Email sending result: ".$data);
      if (mail($to,$subject, $message, $headers)) 
        $log->logMessage("Email successfully sent to ".$to);
     else 
        $log->logMessage("Email sending failed to ".$to);
      
      
   }  