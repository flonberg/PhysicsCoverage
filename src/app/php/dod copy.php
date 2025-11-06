<?php

include 'H:\inetpub\lib\sqlsrvLibconnAM_mq.inc';
include 'H:\inetpub\lib\sqlsrvLibconnAM.inc';
$handle = connectDB_AM();	
$handleMSQ = connectDB_AM_mq();
$debug = isset($_GET['debug']) ? true : false;
echo "<br> debug <br>"; var_dump($debug);

//Create Record ID for dodReminder
$qDOD="INSERT INTO dodReminder DEFAULT VALUES SELECT SCOPE_IDENTITY() as 'dodID'";
$rDOD=@sqlsrv_query($handle, $qDOD);

$dodID=lastId_output($rDOD);
function lastId_output($queryID) {
     sqlsrv_next_result($queryID);
     sqlsrv_fetch($queryID);
     return sqlsrv_get_field($queryID, 0);
}

//GET DOD Active DOD Dates
$dodDates = array();
$qDates = "SELECT
DISTINCT TOP 7
	App_DtTm
FROM
	vw_Schedule 
WHERE
	LOCATION = 'Daily Coverage' 
	AND Location_ID = 2573 
	AND Activity = 'DOD' 
	AND DEPT = 'MGH' 
    AND App_DtTm > GETDATE()
ORDER BY
	App_DtTm";

$rDates = @sqlsrv_query($handleMSQ, $qDates);

if($rDates)
{
    while($rowDates = sqlsrv_fetch_array($rDates))
    {
    $dodDates[]=$rowDates['App_DtTm']->format('Y-m-d');   

    }
}
else
{
    echo '<small class="text-danger">Unable to get DOD Dates from MOSAIQ. qDates function has failed.</small>';
    echo '<br><small>'.$qDates.'</small></br>';
}
echo "<br> ret <br>"; var_dump($dodDates);

$dayStart = $dodDates[2];
$dayEnd = $dodDates[3];

//TestingWeekends
/*
$dayStart = $dodDates[5];
$dayEnd = $dodDates[6];
*/
echo $dayStart;
$recipientList = array();


//Get MOSAIQ Data
$qMosaiq="SELECT
* 
FROM
vw_Schedule 
WHERE
LOCATION = 'Daily Coverage' 
AND Location_ID = 2573 
AND Activity = 'DOD' 
AND DEPT = 'MGH' 
AND App_DtTm > '$dayStart'
AND App_DtTm < '$dayEnd'
ORDER BY
App_DtTm";
$rMosaiq = @sqlsrv_query($handleMSQ, $qMosaiq);
if($rMosaiq)
{
    while($row=sqlsrv_fetch_array($rMosaiq))
    {
        $mosaiqArray[]=$row;
    }
} else
{
    echo '<small class="text-danger">Unable to get Array from MOSAIQ. qMosaiq function has failed.</small>';
    echo '<br><small>'.$qMosaiq.'</small></br>';   
}

foreach($mosaiqArray as $key=>$value)
{
    if($value['App_DtTm']->format('H')<12)
    {
    $amArray = $value;
    echo '<h1>AM</h1>';
    $dodDateSQL = $value['App_DtTm']->format('l F d, Y');
    }

    if($value['App_DtTm']->format('H')>=12)
    {
    $pmArray = $value;
    echo '<h1>PM</h1>';
    $dodDateSQL = $value['App_DtTm']->format('l F d, Y');
    }
}
$amPhysicianLastName = trim($amArray['STF_LAST_NAME']);
$amPhysicianSQL = strtolower(trim($amArray['STF_LAST_NAME']));

$pmPhysicianLastName = trim($pmArray['STF_LAST_NAME']);
$pmPhysicianSQL = strtolower(trim($pmArray['STF_LAST_NAME']));
echo "<br> 112 $pmPhysicianLastName  ---  $amPhysicianLastName";
//Get Physician eMail
$qPhys = "SELECT
physicians.Email,
physicians.LastName,
physicians.UserKey,
users.UserID
FROM physicians
LEFT JOIN users ON physicians.UserKey = users.UserKey
WHERE
Rank='0' and LOWER(LastName) IN ('$amPhysicianSQL','$pmPhysicianSQL')";
$rPhys = @sqlsrv_query($handle, $qPhys);
while($rowPhys = sqlsrv_fetch_array($rPhys))
{
    $recipientInfo[strtolower($rowPhys['LastName'])]= array($rowPhys['Email'], $rowPhys['UserKey'], $rowPhys['UserID']);
    $recipientList[]= $rowPhys['Email'];
}
echo "<br> 90 <br>"; var_dump($recipientList);


//Create Message
$bccList = array('FLONBERG@PARTNERS.ORG','jwolfgang@mgh.harvard.edu','SLBATCHIS@PARTNERS.ORG');
//$bccList = array('rjconnolly@partners.org');
$recipientsBCC = implode($bccList, ', ');


$subject = 'You are scheduled as Doctor of the Day '.$dodDateSQL.'';			
$headers = 'From: whiteboard@partners.org'. "\r\n";
$headers .= 'Reply-To: whiteboard@partners.org'. "\r\n";
$headers .= 'Bcc: '.$recipientsBCC.''. "\r\n";
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
$message .= '<tr><td colspan=\'2\'>The Daily Coverage schedule has indicated that you are assigned as Doctor of the Day (DOD)</td></tr>';
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
$message .= '<tr><td colspan=\'2\'>This is 1-time courtesy reminder. Please refer to the MOSAIQ schedule for the most up to date and accurate information.</td></tr>';
$message .= '<tr><td colspan=\'2\'>DOD Scheduling Information is located in MOSAIQ &#8594; Schedule &#8594; Daily Coverage</td></tr>';
$message .= '<tr><td colspan=\'2\'>This email address is NOT monitored. For any changes to this assignment, you must contact your administrative assistant.</td></tr>';
$message .= '<tr><td colspan=\'2\'><hr></td></tr>';
$message .= '<tr><td colspan=\'2\' align="center">Noitce Sent on '.date('m/d/Y h:i A').'</td></tr>';
$message .= '<tr><td colspan=\'2\' align="center"><em>Whiteboard DOD Reminder Record: '.$dodID.'</em></td></tr>';
$message .= '</table>';
$message .= '</body></html>'; 

foreach($mosaiqArray as $key=>$value)
{
    if($value['App_DtTm']->format('H')<12)
    {
        $amApp_DtTm = $value['App_DtTm']->format('Y-m-d h:i');
        $amPhysician = trim($value['STF_LAST_NAME']);
        $amStaff_ID = $value['Staff_ID'];
        $amUserKey = $recipientInfo[trim(strtolower($value['STF_LAST_NAME']))][1];
        $amUserID = $recipientInfo[trim(strtolower($value['STF_LAST_NAME']))][2];
    }
    else
    {
        $pmApp_DtTm = $value['App_DtTm']->format('Y-m-d h:i');
        $pmPhysician = trim($value['STF_LAST_NAME']);
        $pmStaff_ID = $value['Staff_ID'];
        $pmUserKey = $recipientInfo[trim(strtolower($value['STF_LAST_NAME']))][1];
        $pmUserID = $recipientInfo[trim(strtolower($value['STF_LAST_NAME']))][2];
    }
}

    $messageStripped = strip_tags($message);
    $recipientsListExpanded = implode($recipientList,', ');
    if ($debug)
        $recipientsListExpanded = 'flonberg@mgh.harvard.edu';    
    $recipientsBCC = implode($bccList, ', ');
    $qWb="UPDATE dodReminder SET 
    amApp_DtTm='$amApp_DtTm', 
    amPhysician='$amPhysician', 
    amStaff_ID='$amStaff_ID', 
    amUserKey='$amUserKey', 
    pmPhysician='$pmPhysician',
    pmStaff_ID='$pmStaff_ID',
    pmApp_DtTm='$pmApp_DtTm', 
    pmUserKey='$pmUserKey', 
    messageSubject='$subject', 
    messageHeaders='$headers', 
    messageRecipients='$recipientsListExpanded', 
    messageRecipientsBCC='$recipientsBCC',
    messageContent = '$messageStripped',
    amUserID = '$amUserID',
    pmUserID = '$pmUserID'
    WHERE
    dodID=$dodID";
    $rWb = @sqlsrv_query($handle, $qWb);
    if($rWb)
    {
        mail(''.$recipientsListExpanded.'',$subject, $message, $headers);
    }
    else
    {
        echo '<hr>';
        echo '<small class="text-danger">Unable to insert message data to Wb. qWb function has failed.</small>';
        echo '<br><small>'.$qWb.'</small></br>';   
        echo '<hr>';
        if( ($errors = sqlsrv_errors() ) != null) {
            foreach( $errors as $error ) {
                echo "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
                echo "code: ".$error[ 'code']."<br />";
                echo "message: ".$error[ 'message']."<br />";
            }
        }
    }
echo '<hr>';
    echo $message;

?>