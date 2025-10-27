<?php
ini_set('error_reporting', 0);
ini_set('display_errors', 0);
session_start();

include 'H:\inetpub\lib\sqlsrvLibconnAM.inc';
$handle = connectDB_AM();
include("../arrays/name_arrays.php");
if(isset($_GET['userid']))
{
	$userid = $_GET['userid'];
}
else
{
	$userid = $_SESSION['userid_on_call_session'];
}



$qm="select userid from on_call_mgmt";
$rm=@sqlsrv_query($handle, $qm);
while($rowm=sqlsrv_fetch_array($rm))
{
	$mgmt[]=$rowm['userid'];
}

$q1x="SELECT DISTINCT(CONVERT(VARCHAR(12), start_date, 107)) as start_date, start_date as start_date_prime from on_call where end_date >=getdate() and disposition='1' order by start_date_prime";
$r1x=@sqlsrv_query($handle, $q1x);
echo '<table class="table table-sm" style="width:100%; padding:2%;">';
while($row1x=sqlsrv_fetch_array($r1x))
	{
	$starting_date = $row1x['start_date_prime']->format('Y-m-d');;
	

	
$q2="select * from on_call where start_date like '$starting_date%' and end_date >=getdate() and disposition='1' order by CASE role WHEN 'ATTENDING' THEN 1
		WHEN 'RESIDENT' THEN 2 
		WHEN 'RTT-LEAD' THEN 3
		WHEN 'RTT-TRAINING' THEN 4
		WHEN 'PHYSICS' THEN 5
		ELSE 6
		END";
$r2=@sqlsrv_query($handle, $q2);
if($r2)
{

		echo '<thead class="thead-light" style="padding-top:10%;">';
		echo '<tr>';
			echo '<th>Staff</th>';
			echo '<th>Role</th>';
			echo '<th>Start Date</th>';
			echo '<th>End Date</th>';
			echo '<th>Comments</th>';
			echo '<th>Edit</th>';
		echo '</tr>';
		echo '<thead>';
		while($row=sqlsrv_fetch_array($r2))
		{
		$UserKey = $row['person'];
			
			if($row['person']==$userid)
		
		{echo '<tr class="mirai_highlight_accent" >';}
			else
		{echo '<tr class="mirai_highlight">';}
			echo '<td valign="middle">';
			if($row['role']=='ATTENDING' || $row['role']=='RESIDENT' || $row['role']=='NWH-ATTENDING')
			{
			if(file_exists("../images/physicians/".$UserKey.".jpg"))
				
			{echo '<img src="../images/physicians/'.$UserKey.'.jpg" style="display:inline;border-radius:30px 1px 30px 1px; vertical-align:middle;"  width="66" height="77" >';}
				else
				{
				echo '<i class="fas fa-4x fa-user"></i>';	
				}
				
			echo '&nbsp;&nbsp; Dr. '.$md[$row['person']];	
			}
			else if($row['role']=='PHYSICS')
			{
			$qx="select UserID from users where UserKey='$UserKey'";
			$rx=@sqlsrv_query($handle, $qx);
				if($rx)
				{
				$rowx=sqlsrv_fetch_array($rx);
				
				}
			if(file_exists("../images/users/".trim($rowx['UserID']).".jpg"))
				
			{echo '<img src="../images/users/'.$rowx['UserID'].'.jpg" style="display:inline;border-radius:30px 1px 30px 1px; vertical-align:middle;"  width="66" height="77" >';}
				else
				{
				echo '<i class="fas fa-4x fa-user"></i>';	
				}
				echo '&nbsp;&nbsp; '.$physics[$row['person']];
			}
			else
			{
			$qx="select UserID from users where UserKey='$UserKey'";
			$rx=@sqlsrv_query($handle, $qx);
				if($rx)
				{
				$rowx=sqlsrv_fetch_array($rx);
				if(file_exists("../images/users/".trim($rowx['UserID']).".jpg"))
				
			{echo '<img src="../images/users/'.$rowx['UserID'].'.jpg" style="display:inline;border-radius:30px 1px 30px 1px; vertical-align:middle;"  width="66" height="77" >';}
				else
				{
				echo '<i class="fas fa-4x fa-user"></i>';	
				}
				
				}
			
			echo '&nbsp;&nbsp; '.$other[$row['person']];
			}
			echo '</td>';
			echo '<td align="center" style="letter-spacing: 1px;">'.ucfirst($row['role']).'</td>';
			$start_date_formatted=$row['start_date']->format('M d, Y');
			$start_date_formatted_day = $row['start_date']->format('D');
			$end_date_formatted=$row['end_date']->format('M d, Y');
			$end_date_formatted_day=$row['end_date']->format('D');
			echo '<td align="center">'.$start_date_formatted.'<br><small>'.$start_date_formatted_day.'</small></td>';
			echo '<td align="center">'.$end_date_formatted.'<br><small>'.$end_date_formatted_day.'</small></td>';
			echo '<td>'.$row['comments'].'</td>';
			echo '<td align="center">';
			if(in_array($userid,$mgmt))
			{
			echo '<input type="button" class="btn btn-sm btn-secondary" value="Edit" onclick="edit_assignment('.$row['on_call_id'].')" id="button_'.$row['on_call_id'].'">';
			}
			else
			{
			echo '';
			}
			echo '</td>';
		echo '</tr>';
		}
}
	
}
echo '</table>';
?>