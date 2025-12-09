<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();       
    $log = new LogFuncs();

   //Get ResidentTriageDuty Assignments
    $selStr = "SELECT top(1) userkey FROM ResidentTriageDuty WHERE day = '".nextWeekday()."' ORDER BY idx DESC";
    if ($_GET['debug'] == 1)
        echo "\r\n selStr: $selStr \r\n";
    $dodIDString = getSingle($selStr, 'userkey', $handle);
    $selStr = "SELECT FirstName, LastName, Email FROM physicians WHERE UserKey = '".$dodIDString."'";
        $stmt = sqlsrv_query( $handle, $selStr);
        if( $stmt === false )
            { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }
    $data = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
    $log->logMessage("Fetched user data for userkey ".$dodIDString.": ".print_r($data, true));
    $recipients = array($data['Email']);
    $log->logMessage("Preparing to send email to ".$data['Email']);
    if (strpos(getcwd(), 'dev') !== false) {
        $recipients = array('FLONBERG@PARTNERS.ORG');
        $log->logMessage("Not on production server, changing recipient to ". $recipients[0]);  
    }
    $bccList = array('FLONBERG@PARTNERS.ORG');  
//$bccList = array('rjconnolly@partners.org');

$subject = 'Resident Triage Coverer Reminder for '.nextWeekday();			
$headers = 'From: whiteboard@partners.org'. "\r\n";
$headers .= 'Reply-To: whiteboard@partners.org'. "\r\n";
$headers .= 'Bcc: '.$bccList[0]."\r\n";
$headers .= 'MIME-Version: 1.0'. "\r\n";
$headers .= 'Content-Type: text/html; charset=ISO-8859-1'. "\r\n";
$message =  '<html>';
$message .= '<head>';
$message .= '<style>.attention{font-size: large; padding:10;} .bigAttention{font-size: x-large;}</style>';
$message .= '</head>';
$message .= '<body>';
$message .= 'Greetings Dr.'.$data['FirstName'].' '.$data['LastName'].',<br><br>';
$message .= '<h3> You are scheduled as Resident Triage Coverer for next treatment day, '.nextWeekday().'</h3>';
$message .= '<p> This is a courtesy reminder. </p>';
$message .= '<p class="attention"> Please remember to check the Resident Triage page on the  Whiteboard, Sa tab, for any updates or changes. </p>';

$message .= '</body></html>'; 
//Send Email

   if (mail($recipients[0],$subject, $message, $headers)) 
        $log->logMessage("Email successfully sent to ".$recipients[0]);
     else 
        $log->logMessage("Email sending failed to ".$recipients[0]);

    exit();
function nextWeekday(){
    $currentDate = new DateTime(); // Get the current date
    $currentDate->modify('next weekday'); // Move to the next weekday
    return $currentDate->format('Y-m-d');
}
?>