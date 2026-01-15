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
      $link = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$taData['vidx']."&newValueName=approved&newValue=1&debug=1";
      $to = 'bnapolitano@partners.org';
      $to = "flonberg@mgh.harvaard.edu";     
      $subject = "Time Away Update";
      $message = "The Time Away for ".$taData['FirstName']." ".$taData['LastName']." has been updated:\n\n";
  /*    $message .= "Start Date is now: ".$taData['startDate']."\n";
      $message .= "End Date is now: ".$taData['endDate']."\n";
      $message .= "<p> To approve this Time Away, click here <a href='".$link."'>Approve Time Away </a> or go to the Time Away page on the Physics Coverage Whiteboard. </p>";

      $headers = 'From: whiteboard@partners.org'. "\r\n";
      $log->logMessage("Sending email to: ".$to);
      mail($to, $subject, $message, $headers);
      if (mail($to,$subject, $message, $headers)) 
        $log->logMessage("Email successfully sent to ".$to);
     else 
        $log->logMessage("Email sending failed to ".$to);
      */
   }  