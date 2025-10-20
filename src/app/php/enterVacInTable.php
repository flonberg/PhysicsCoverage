<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once('dosimetristList.php');
$handle = connectDB_FL();

   $now = date("Y-m-d h:i:s");
   ////////// in tryVM and enterCov  so must be synched in 3 places \\\\\\\\\\\\\\
//////  dosimetrist array is here and in 'tryVM.php' and enterVacInTable' so must be updated in all 3 places \\\\\\\\\
   $fp = fopen("c:/temp/BBenterVacInTable.txt","a+");
   $rp = fopen("./Alog/enterVacInTableLog.txt", "a+");
   fwrite($rp, "\r\n $now \r\n ");
   ob_start(); var_dump($_GET); $data = ob_get_clean(); fwrite($rp, $data);
   $gp = fopen("c:/temp/checkOverlap2.txt","a+");
   $otherCaseUserId = otherCase($_GET['userid']);	
//   $userkey = getSingle("SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."'", "UserKey", $handle);
   $userkey = getSingle("SELECT UserKey FROM users WHERE UserID = '".$_GET['userid']."' OR UserID = '$otherCaseUserId'", "UserKey", $handle);
								fwrite($fp, "\r \n userkey is $userkey \r\n");
								echo "14  ggggg  $otherCaseUserId ----";
   $sD = new DateTime($_GET['sd']);
   $sDsql = $sD->format("Y-m-d");
   $eD = new DateTime($_GET['ed']);
   $eDsql = $eD->format("Y-m-d");
   //$note = $_GET['note'];
   $note = htmlspecialchars(  $_GET['note']);					///// Aug1_2016
   $reasonIdx = $_GET['reasonIDx'];
   $regDuties = getRegDuties($userkey);

								echo "<br> 26 ffff <br>"; 
   										fwrite($fp, PHP_EOL );fwrite($fp, $now);
   	$insStr = "INSERT INTO vacation3 (startDate, endDate, userid, note, reason, createWhen) values ('$sDsql', '$eDsql', '$userkey', '$note', $reasonIdx,'$now')";	
	
//	$editStr = "UPDATE TOP(1) vacation3 SET startDate='$sDsql', endDate='$eDsql', reason=$reasonIdx, note='$note', approved=0  WHERE vidx = ".$_GET['isEdit']; 
	$delStr = "UPDATE TOP(1) vacation3 SET reasonIdx=99  WHERE vidx = ".$_GET['isEdit']; 

//	if (strcmp($_GET['userid'], 'fjl3') == 0)
	{										//////  Sept 23, 2019  code inserted to prevent bad edit when sd and/of ed is blank 
		$editStr = "UPDATE TOP(1) vacation3 SET  reason=$reasonIdx, note='$note', "; //  WHERE vidx = ".$_GET['isEdit']; 
		if (strlen($_GET['sd']) > 0 )
			$editStr .= "startDate = '$sDsql', "; 
		if (strlen($_GET['ed']) > 0 )
			$editStr .= "endDate = '$eDsql', "; 

		$editStr .= " approved=0  WHERE vidx = ".$_GET['isEdit'];
		
		fwrite($rp, "\r\n line46 \r\n $editStr \r\n");


	}

  	if (strcmp($_GET['isEdit'], "0") == 0){
		fwrite($rp, PHP_EOL );fwrite($rp, "\r\n line50\r\n");
	 //  if (checkOverLap($_GET['sd'], $_GET['ed'], $userkey)){
		//   return;
	 //  }

	   if (strlen($userkey) > 0){						///////  prevent timeAway from being entered without a userkey  \\\\\\\\
	   	$result = sqlsrv_query($handle, $insStr);
   			fwrite($rp, PHP_EOL );fwrite($rp, $now);fwrite($rp, "/r/n line55 \r\n". $insStr );
	   }
	}
	elseif ($_GET['n']== 2){ 
	   $result = sqlsrv_query($handle, $delStr);						
   			fwrite($fp, PHP_EOL );fwrite($fp, $now);fwrite($fp, $delStr );
	}else  { 
	   $result = sqlsrv_query($handle, $editStr);						
   			fwrite($fp, PHP_EOL );fwrite($fp, $now);fwrite($fp, $editStr );
	}
	$lastVidx = getSingle("SELECT Top(1) vidx FROM vacation3 WHERE userid=$userkey ORDER BY vidx DESC", "vidx", $handle);
   			fwrite($fp, PHP_EOL );fwrite($fp, $now);fwrite($fp, "last vidx is $lastVidx ");
	$isDosimetrist = in_array($userkey, $dosimetrist);
	if ($regDuties !== FALSE || $isDosimetrist !== FALSE ){
   		$dows = getDaysForCal3($sDsql, $eDsql);
  		enterCovsInVacCov($regDuties, $dows, $userkey, $lastVidx);
       	 	echo $lastVidx; 
   	}
	if (in_array($userkey, $dosimetrist))
		sendNeedToApproveMail($lastVidx, $userkey);
     exit();

function otherCase($s)
{
	if (preg_Match("/[A-Z]/", $s) ===0)
		return(strtoupper($s));
	if (preg_Match("/[a-z]/", $s) ===0)
		return(strtolower($s));

}

function checkOverlap($sd, $ed, $userkey)
{
	global $handle, $gp, $now; 
	$sdObj = new DateTime($sd);
	$edObj = new DateTime($ed);
	if ($sd > $ed){
		echo "<script>";
		echo "alert('Start Date is later than End Date ')";
		echo "</script>";
		return false;
	}
	//$selStr = "SELECT vidx FROM vacation3 WHERE userid=$userkey AND startDate >= '$sd'  AND endDate <= '$ed'  AND (reasonIdx is NULL OR reasonIdx < 99)";
	$selStr = "SELECT vidx, reasonIdx FROM vacation3 WHERE userid=$userkey AND startDate >= '$sd'  AND endDate <= '$ed' AND reasonIdx IS NULL ";
	$dB = new getDBData($selStr, $handle);
	while ($assoc = $dB->getAssoc())					//  2016-09-20   
		{
		        echo "\n This time-away overlaps one of your existing time-aways". $assoc['vidx'];
			return true;;
		}
							fwrite($gp, PHP_EOL );fwrite($gp, PHP_EOL ); fwrite($gp, $selStr);
	return false;
}



function getRegDuties( $setUserKey)
{
	global $handle, $fp, $dosimetrist;
	$now = date("Y-m-d h:i:s");
	$selStr = "SELECT * from PhysicsRegularDuty WHERE phys1=$setUserKey AND serviceid < 18 AND serviceid <>2";		//////  there is NO duty for 5
   			fwrite($fp, PHP_EOL );fwrite($fp, "$selStr ");
	$physRegDutyDB = new getDBData($selStr, $handle);
	while ($physRegDutyAssoc = $physRegDutyDB->getAssoc()){
		$physRegDuty[$physRegDutyAssoc['serviceid']] = $physRegDutyAssoc;
	}
	if (in_array($setUserKey, $dosimetrist)){
		$first = array("serviceid" => "101");	
		$second = array("serviceid" => "102");	
		$physRegDuty = array("1" => $first, "2" => $second);
	}
	else{
		$physRegDuty[18]['idx'] = 18;
		$physRegDuty[18]['serviceid'] = 18;
	}

	if (isset($physRegDuty))
		return $physRegDuty;
	else
		return false;	
}

function sendNeedToApproveMail($vidx, $userkey)
{
	global $handle, $fp,$rp, $now;
	////////  GET[n] ------  n = 0 --> create timeAway    n = 1 -->  Edit Dates   n = 2 --> Delete timeAway      \\\\\\\\\\\\\\\\\
	$isMailed = getSingle("SELECT approvalMailed FROM vacation3 WHERE vidx = $vidx","approvalMailed",  $handle);  /// has approval been mailed already
//	if ($isMailed == 1)					/////  1  means that the notice of the CREATION of the timeAway has been mailed    \\\\\\\	
//		return;
	$apprUpdateStr =  "UPDATE TOP(1) vacation3 SET approvalMailed = 1 where vidx = $vidx";		// set 'approvalMailed'    
   	fwrite($rp, PHP_EOL );fwrite($rp, $now);  fwrite($rp, PHP_EOL );  fwrite($rp, $apprUpdateStr );
	sqlsrv_query( $handle, $apprUpdateStr);		// set 'approvalMailed'    
	$goAwayerLastName = getSingle("SELECT LastName FROM physicists WHERE UserKey = $userkey", "LastName", $handle);
        $goAwayerUserKey = getSingle("SELECT userid FROM vacation3 WHERE vidx = ". $vidx, "userid", $handle); 
	$link = "\n https://whiteboard.partners.org/esb/FLwbe/vacation/indexPHP.php?first=vM&userid=jadams&vidx=$vidx&func=approve";
//	$mailAddress = "jadams3@partners.org";
	$mailAddress = "bnapolitano@partners.org";
//	$mailAddress = "flonberg@partners.org";					////// changed on 6-24-2016   \\\\\\\\\\\
	$subj = "Vacation Approval";
	$msg =    "Brian: <br>There is a vacation for $goAwayerLastName which needs you approval. ";
	if ($_GET['n'] == 1){
		$subj = "Vacation Change";
		$msg =    "Brian: <br>The dates for $goAwayerLastName time-away have been changed. ";
	}
	if ($_GET['n'] == 2){
		$msg =    "Brian: <br>The time-away for $goAwayerLastName has been deleted. ";
		$subj = "Vacation Deleted";
	}
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
	fwrite($rp, "\r\n $message \r\n ");
   	ob_start(); var_dump($res); $data = ob_get_clean(); fwrite($rp, $data);
}
function enterCovsInVacCov($regDuties, $dows, $userkey, $vidx)
{
	global $handle, $fp, $dosimetrist;
	$now = date("Y-m-d h:i:s");
   								fwrite($fp, PHP_EOL );fwrite($fp, $now);  fwrite($fp, PHP_EOL ); fwrite($fp, "userkey is $userkey " );
								$dump = print_r($_GET, true);
   								fwrite($fp, PHP_EOL );fwrite($fp, $now);  fwrite($fp, PHP_EOL ); fwrite($fp, "GET is $dump " );
									///////////   this works for both NEW and EDITED  timeAways  \\\\\\\\\\\\\
		foreach ($regDuties as $key=>$val){
			if (is_array($dows)){
			foreach ($dows as $dKey=>$dVal){
				$selStr = "SELECT TOP(1) idx FROM vacCov2 WHERE vidx=".$_GET['isEdit']." AND dutyId=".$val['serviceid'] ." AND covDate = '".$dVal['wholeDate']."'"; 
   				fwrite($fp, PHP_EOL );fwrite($fp, $now);fwrite($fp, $selStr );
				$idxFound = getSingle($selStr, "idx",  $handle);
   				fwrite($fp, PHP_EOL );fwrite($fp, "idxFound is $idxFound");
				if (strlen($idxFound)  < 2){
					$insStr = "INSERT INTO vacCov2 ( covDate, vidx, dutyId, enteredWhen, goAwayerUserKey) values ( '".$dVal['wholeDate']."',$vidx, ".$val['serviceid'].",'$now', $userkey)";
	   				fwrite($fp, PHP_EOL );fwrite($fp, $now);fwrite($fp, $insStr );
					sqlsrv_query( $handle, $insStr);
				}
			}
			}
		}
}
 function getDaysForCal3($sd, $ed)
{
	$lastDayTS = strtoTime($ed);
	$firstDayTS = strtoTime($sd);
	$firstDay = date("l", $firstDayTS);
	$i = 0;
	do {
		$tst = date("N",  $firstDayTS) ; 
		if ($tst > 0 && $tst < 6){
			$dow[$i]['dow'] = date("D", $firstDayTS);
			$dow[$i]['month.day'] = date("M. j ", $firstDayTS);
			$dow[$i]['wholeDate'] = date("Y-m-d", $firstDayTS);
		}
		$ndTS[$i] = strtotime("+ 1 day", $firstDayTS);
		$firstDayTS = $ndTS[$i] ; 						
								if ($i > 60) 		// safety
									break;
	}
		while ($ndTS[$i++] <= $lastDayTS);
	if (isset($dow))
	return $dow;
}

