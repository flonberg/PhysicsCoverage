<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
$handle = connectDB_FL();
   $fp = fopen("H:\\inetpub\\logs\\GB_FLlogs\\".$loc."\\sendTriageCovMaillog.txt", "a+");
   fwrite($fp,  "\r\n". date("Y-m-d H:i:s") . "\n");
   $dstr = print_r($_GET, true); fwrite($fp, $dstr);
   //Get ResidentTriageDuty Assignments
    $selStr = "SELECT top(1) userkey FROM ResidentTriageDuty WHERE day = DATEADD(day,1,CAST(GETDATE() AS date))";
    echo $selStr . "\n";
    $dodIDString = getSingle($selStr, 'userkey', $handle);
    var_dump($dodIDString);
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


$subject = 'You are scheduled as Resident Triage Coverer tomorrow '.$dodDateSQL.'';			
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
$message .= '<table style="font-family: \'Open Sans\', sans-serif;
border:none;
background-color:white;
border-color:#A3A3A3;
border-width:thin;
font-size:13px;" width="85%">';
$message .= '<tr class="attention"><td colspan=\'2\'>Doctor Of The Day (Automated) Reminder</td></tr>';
$message .= '<tr><td colspan=\'2\'><hr/></td></tr>';
$message .= '<tr class="bigAttention"><td colspan=\'2\'>'.$dodDateSQL.'</td></tr>';
$message .= '<tr><td colspan=\'2\'>The Daily Coverage schedule has indicated that you are assigned as to Resident Triage Coverer</td></tr>';
$message .= '<tr><td colspan=\'2\'></td></tr>';
if(is_null($amArray))
{
    $message .= '<tr class="attention"><td width="15%">MGH DOD AM: </td><td><font color="red"><b>ASSIGNMENT MISSING!</b></font></td></tr>';
}
else
{
$message .= '<tr class="attention"><td width="15%">'.$amArray['DEPT'].' DOD AM: </td><td align="left">'.trim($amArray['STF_LAST_NAME']).', '.$amArray['STF_FIRST_NAME'].' (6:45 AM - 12:30 PM)</td></tr>';
}
if(is_null($pmArray))
{
    $message .= '<tr class="attention"><td width="15%">MGH DOD PM: </td><td><font color="red"><b>ASSIGNMENT MISSING!</b></font></td></tr>';
}
else
{
$message .= '<tr class="attention"><td width="15%">'.$pmArray['DEPT'].' DOD PM: </td><td align="left">'.trim($pmArray['STF_LAST_NAME']).', '.$pmArray['STF_FIRST_NAME'].' (12:30 PM - End of Treatments)</td></tr>';
}
$message .= '<tr><td colspan=\'2\'></td></tr>';
$message .= '<tr><td colspan=\'2\'>This is 1-time courtesy reminder. Please refer to the Resident Triage schedule for the most up to date and accurate information.</td></tr>';;
$message .= '<tr><td colspan=\'2\'><hr></td></tr>';
$message .= '<tr><td colspan=\'2\' align="center">Noitce Sent on '.date('m/d/Y h:i A').'</td></tr>';
$message .= '</table>';
$message .= '</body></html>'; 
//Send Email

   if (mail('flonberg@mgh.harvard.edu',$subject, $message, $headers)
    ) {
        fwrite($fp,  "Email successfully sent.\n");
    } else {
        fwrite($fp,  "Email sending failed to flonberg@mgh.harvard.edu\n");
    }
        
    fclose($fp);
    exit()
?>