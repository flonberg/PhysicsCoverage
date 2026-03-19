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
   $oldValue = getSingle("SELECT ".$_GET['newValueName']." from vacation3 WHERE vidx = ".$_GET['vidx'], $_GET['newValueName'], $handle);
   $log->logMessage("Old value: ". print_r($oldValue, true));
   if (strpos($_GET['newValueName'],'coverageA') !== false ){  // change in coverer, send email to new coverer
      $_GET['newValue'] = getUserKeyFromName($_GET['newValue']);
   }
   $updateStr = "UPDATE top(1) vacation3 SET ".$_GET['newValueName']." = '".$_GET['newValue']."' WHERE vidx = ".$_GET['vidx'];   
   //$log->logSql($updateSts);
   $log->logMessage("Executing query: ".$updateStr);
   $stmt = sqlsrv_query( $handle, $updateStr);
   if( $stmt === false )
      $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true));
  
   if ($_GET['fromLink'] == '1'){                                                      // go here from link in email
      if (strpos($_GET['newValueName'],'approved') !== false ){                        // echo appropriate message
         echo "<br> Time Away Approved: <br>";
      }
      if (strpos($_GET['newValueName'],'allAccepted') !== false){
         echo "<br> Coverage Accepted <br>";
      }
      exit();
   }

   exit(0);
   /** need to get UserKey from LastName, FirstName */
   function getUserKeyFromName($name){
      global $log;
      $handle = connectDB_FL();
      $lastName = strstr($name, ',', true);                       // get string before comma for last name
      $firstName = trim(strstr($name, ','), ', ');                // get string after comma for first name
       $log->logMessage("Extracted lastName: ". $lastName . " and firstName: " . $firstName);
      
      $selStr = "SELECT UserKey FROM physicists WHERE LastName = '".$lastName."' AND FirstName = '".$firstName."'";
      $log->logMessage("Executing query: ".$selStr);
      $stmt = sqlsrv_query( $handle, $selStr);
      if( $stmt === false )
         $log->logMessage("SQL errors: ". print_r( sqlsrv_errors(), true));
      $data = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
      $log->logMessage("Data: ". print_r($data, true));
      return $data['UserKey'];
   } 
   function getStringAfterComma($name){
      return trim(strstr($name, ','), ', ');
   }   
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
   function sendEmailCoverer($goAwayerData, $covererData, $lastInsertedIdx){
      global $log;
      $approverEmail = 'bnapolitano@partners.org';
    //  $approverEmail = "flonberg@mgh.harvard.edu";                      // change to Brian's email when ready
      $goAwayer['Email'] = "flonberg@mgh.harvard.edu";                     // change to go awayer email when ready
      $link = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$lastInsertedIdx."&newValueName=approved&newValue=1&debug=1";
      $link2 = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?vidx=".$lastInsertedIdx."&newValueName=allAccepted&newValue=1&debug=1";
         $subject = 'Time Away Entered for '.$goAwayerData['FirstName'].' '.$goAwayerData['LastName'] ;			
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
         $message2 = $covererData['FirstName'].' '.$covererData['LastName'].'<br><br>';
         $message2 .= '<p> ' . $goAwayerData['FirstName'].' '.$goAwayerData['LastName']." has nominated you to cover a Time Away from ".$_GET['startDate'] ." to ". $_GET['endDate']." .</p>";
         $message2 .= "<p> To accept coverage for this Time Away, click here <a href='".$link2."'>Accept Coverage </a> . </p>";
         $message2 .= '</body></html>'; 
      $log->logMessage("6565 Preparing to send email notification for go awayer: ". print_r($goAwayerData, true));
//Send Email
      $wholeMessage = $message . $message2;
   
   if (mail($covererData['Email'],$subject, $wholeMessage, $headers)) 
        $log->logMessage("Email successfully sent to ".$covererData['Email']);
      else 
        $log->logMessage("Email sending failed to ".$covererData['Email']);
   }
 

