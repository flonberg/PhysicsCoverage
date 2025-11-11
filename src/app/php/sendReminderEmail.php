<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();

    $log = new LogFuncs();
    $log->logMessage("Script started");
   //Get ResidentTriageDuty Assignments
    $selStr = "SELECT top(1) userkey FROM ResidentTriageDuty WHERE day = DATEADD(day,1,CAST(GETDATE() AS date)) ORDER BY idx DESC";
    echo $selStr . "\n";
    $dodIDString = getSingle($selStr, 'userkey', $handle);
    $selStr = "SELECT FirstName, LastName, Email FROM physicians WHERE UserKey = '".$dodIDString."'";
        $stmt = sqlsrv_query( $handle, $selStr);
        if( $stmt === false )
            { $dstr = ( print_r( sqlsrv_errors(), true)); fwrite($fp, "\r\n errors: \r\n ".$dstr); }
        $data = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC);
        echo "<br>"; var_dump($data);

   
$recipients = array($data['Email']);
$recipients = array('FLONBERG@PARTNERS.ORG');
$bccList = array('FLONBERG@PARTNERS.ORG');
//$bccList = array('rjconnolly@partners.org');


$subject = 'Resident Triage Coverer Reminder for '.date('l F d, Y', strtotime('+1 day')).'';			
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
$message .= 'Greetings Dr.'.$data['FirstName'].' '.$data['LastName'].',<br><br>';
$message .= '<h3> You are scheduled as Resident Triage Coverer tomorrow '.date('l F d, Y', strtotime('+1 day')).'</h3>';
$message .= '<p> This is a courtesy reminder. </p>';
$message .= '<p class="attention"> Please remember to check the Resident Triage page on the  Whiteboard, Sa tab, for any updates or changes. </p>';

$message .= '</body></html>'; 
//Send Email

   if (mail('flonberg@mgh.harvard.edu',$subject, $message, $headers)
    ) {
        fwrite($fp,  "Email successfully sent to ".$recipients[0]."\n");
    } else {
        fwrite($fp,  "Email sending failed to flonberg@mgh.harvard.edu\n");
    }
        
    fclose($fp);
    exit()
?>