<?php
include 'H:\inetpub\lib\sqlsrvLibconnAM.inc';
$handle = connectDB_AM();
$person = $_GET['person'];
$start_date = $_GET['start_date'];
$end_date = $_GET['end_date'];
$comments = $_GET['comments'];
// Jing added on 06/10/2024 to replace all single quote with the HTML entity
$comments = str_replace("'","&apos;",$comments);
$role = $_GET['role'];
$added_by = $_GET['added_by'];
$workstation = gethostbyaddr($_SERVER['REMOTE_ADDR']);	
$ip_address=$_SERVER['REMOTE_ADDR'];
$q="insert into on_call (person, start_date, end_date, comments, role, added_by, workstation, ip_address) values ('$person','$start_date','$end_date','$comments','$role','$added_by','$workstation','$ip_address')";
$r = @sqlsrv_query($handle, $q);
if(!$r)
{print_r(sqlsrv_errors());}
else
{
	echo '<font color="green">Record Added'. print_r(getdate()).'</font>';
}


require_once("oncall_schedule.php"); 
/*
require_once("https://whiteboard.partners.org/cgi-bin/oncall/oncall_schedule.php?userid=$added_by");
*/
?>