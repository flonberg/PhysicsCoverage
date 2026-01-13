<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
require_once '.\dosimetristList.php';

$handle = connectDB_FL();
    $log = new LogFuncs();
    $log->logMessage("Received GET parameters: ". print_r($_GET, true));
    if (isset($_GET['vidx']) == false || isset($_GET['newValueName']) == false || isset($_GET['newValue']) == false){
       $log->logMessage("Missing parameters in editTAs.php");
       exit();
    }
   $GoAwayerUserKey = getSingle("SELECT userid from vacation3 WHERE vidx = ".$_GET['vidx'], "userid", $handle);
   $isDosimetrist = in_array($GoAwayerUserKey, $dosimetrist);
   $log->logMessage("isDosimetrist: ". ($isDosimetrist ? 'true' : 'false'));
   $oldValue = getSingle("SELECT ".$_GET['newValueName']." from vacation3 WHERE vidx = ".$_GET['vidx'], $_GET['newValueName'], $handle);
   $log->logMessage("Old value: ". print_r($oldValue, true));
   $updateSts = "UPDATE top(1) vacation3 SET ".$_GET['newValueName']." = '".$_GET['newValue']."' WHERE vidx = ".$_GET['vidx'];   
   $log->logSql($updateSts);
   if (strpos($_GET['newValueName'],'approved') !== false){
      echo "<br> Time Away Approved: <br>";
   }
   if (strpos($_GET['newValueName'],'allAccepted') !== false){
      echo "<br> Coverage Accepted <br>";
   }
  // if (strpos($_GET['newValueName'],'startDate') !== false || strpos($_GET['newValueName'],'endDate') !== false){
     // echo "<br> Start Date Changed <br>";
  // }
   exit(0);
   function getParamOfTa($vidx){
      global $log;
      $handle = connectDB_FL();

      $GoAwayerUserID = getSingle("SELECT UserID from users WHERE UserKey = ".$GoAwayerUserKey, "UserID", $handle);
      $GoAwayerLastName = getSingle("SELECT LastName from physicists WHERE UserKey = ".$GoAwayerUserKey, "LastName", $handle);
      if ($GoAwayerLastName === null){
          $GoAwayerLastName = getSingle("SELECT LastName from physicians WHERE UserKey = ".$GoAwayerUserKey, "LastName", $handle);
      }
   }
   function sendEmailtoBrianAndCoverer($goAwayerData, $covererData, $lastInsertedIdx){
      global $log;
      $approverEmail = 'bnapolitano@partners.org';
      $approverEmail = "flonberg@mgh.harvard.edu";                      // change to Brian's email when ready
      $goAwayer['Email'] = "flonberg@mgh.harvard.edu";                     // change to go awayer email when ready
      $link = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$lastInsertedIdx."&newValueName=approved&newValue=1&debug=1";
      $link2 = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$lastInsertedIdx."&newValueName=allAccepted&newValue=1&debug=1";
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
   
   if (mail($approverEmail,$subject, $wholeMessage, $headers)) 
        $log->logMessage("Email successfully sent to ".$approverEmail);
     else 
        $log->logMessage("Email sending failed to ".$approverEmail);
      $wholeMessage = $message . $message2;
   if (mail($covererData['Email'],$subject, $wholeMessage, $headers)) 
        $log->logMessage("Email successfully sent to ".$covererData['Email']);
      else 
        $log->logMessage("Email sending failed to ".$covererData['Email']);
   }
