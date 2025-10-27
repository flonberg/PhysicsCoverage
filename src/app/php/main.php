<!doctype html>
<?php
session_start();
?>
<html>
<head>
<meta charset="UTF-8">
<title>MGH OnCall Schedule</title>
<?php require("../includes/treasureChest.php");?>
<script src="../js/jquery.colorbox.js"></script>
<script type="text/javascript">
function getperson(role_group)
{

		if (window.XMLHttpRequest)
 			{// code for IE7+, Firefox, Chrome, Opera, Safari
  			xmlhttp=new XMLHttpRequest();
	 		}
			else
  			{// code for IE6, IE5
  			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange=function()
  			{
  			if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    		{
    			document.getElementById("person_results").innerHTML=xmlhttp.responseText;
    			}
			}
			xmlhttp.open("GET","getperson.php?role_group="+role_group+"",true);
			xmlhttp.send();
  }
</script>
<script type="text/javascript">
function insert_record()
{
var person = document.getElementById("hidden_person").value;
var start_date = document.getElementById("start_date").value;
var end_date = document.getElementById("end_date").value;
var comments = document.getElementById("comments").value;
var role = document.getElementById("role_group").value;
var userid = document.getElementById("userid").value;
	
		if (window.XMLHttpRequest)
 			{// code for IE7+, Firefox, Chrome, Opera, Safari
  			xmlhttp=new XMLHttpRequest();
	 		}
			else
  			{// code for IE6, IE5
  			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange=function()
  			{
  			if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    		{
    			document.getElementById("schedule_results").innerHTML=xmlhttp.responseText;
    			}
			}
			// Jing added on 06/10/2024 for passing special params
			comments = encodeURIComponent(comments);
			//////////////////////////////////////////
			xmlhttp.open("GET","add_assignment.php?person="+person+"&start_date="+start_date+"&end_date="+end_date+"&role="+role+"&comments="+comments+"&added_by="+userid+"",true);
			xmlhttp.send();
  }
function update_person(str)
	{
		document.getElementById("hidden_person").value=str;
		
	}
function edit_assignment(on_call_id)
	{
	
	var userid = document.getElementById("userid").value;
	jQuery().colorbox({width:"85%", height:"80%", iframe:true, href:"edit.php?on_call_id="+on_call_id+"&userid="+userid+""});
	}
function myschedule(on_call_id)
	{
	
	var userid = document.getElementById("userid").value;
	jQuery().colorbox({width:"85%", height:"80%", iframe:true, href:"myschedule.php?userid="+userid+""});
	}

function past_records()
	{
	var userid = document.getElementById("userid").value;
	jQuery().colorbox({width:"85%", height:"80%", iframe:true, href:"historical.php?userid="+userid+""});	
	}

function stats()
	{
	var userid = document.getElementById("userid").value;
	jQuery().colorbox({width:"85%", height:"80%", iframe:true, href:"stats.php?userid="+userid+""});	
	}


function auto_days()
	{
	var start_date = document.getElementById("start_date").value;
	var dateString = start_date;
	var dateObject = new Date(dateString);
	dateObject.setDate(dateObject.getDate() + 6);
	var year = dateObject.getFullYear();
	var month = dateObject.getMonth() >12 ? "0"+ (dateObject.getMonth()+1) : dateObject.getMonth()+1
	var date =  dateObject.getDate() < 10 ? '0'+ dateObject.getDate(): dateObject.getDate()
	
	var end_date_formatted =''+month + '/'+date+'/'+year+'';
	document.getElementById("end_date").value = end_date_formatted;
	document.getElementById("end_date_text").innerHTML = '<font color="green" style="font-size:8px">+6 Days Automatically Selected</font>';
	}
	</script>
	
</head>

<body>
<?php 
$userid=$_GET['userid'];
$_SESSION['userid_on_call_session']=$userid;


	

?>
 <input type="hidden" name="userid" id="userid" value="<?php echo $_GET['userid'];?>">
<div id="container-fluid" style="padding:2%;">
<h1><a href="../rtt/rtt.php?userid=<?php echo $userid;?>"><img src="../images/wb_icon_text.jpg" width="130" height="130" alt="wbicon" /></a> MGHRO On-Call Schedule    </h1>

 <?php
include 'H:\inetpub\lib\sqlsrvLibconnAM.inc';
$handle = connectDB_AM();
$userid=$_GET['userid'];
	
$application_log_var = 'On-Call Schedule';
include 'H:\inetpub\lib\audit_log.inc';			  
	  
$qm="SELECT userid FROM on_call_mgmt WHERE active = 1";
$rm=@sqlsrv_query($handle, $qm);
while($rowm=sqlsrv_fetch_array($rm))
{
	$mgmt[]=$rowm['userid'];
}
if(in_array($userid,$mgmt))
{
	  
 echo '<div class="container-fluid"><form name="add_oncall">
  	<table class="table table-hover table-striped">
		<thead>
		<tr>
			<th>Role</th>
			<th>Person</th>
			<th>Start Date</th>
			<th>End Date</th>
			<th colspan="2">Comments</th>
		</tr>
		</thead>
		<tr>
			<td><select name="role_group" id="role_group" onchange="getperson(this.value);" class="form-control">
				<option value="xx\" selected=\"selected\">**Select Role**</option>
				<option value="ATTENDING">MD - Attending</option>
				<option value="RESIDENT">MD - Resident</option>
				<option value="RTT-LEAD">RTT - Lead</option>
				<option value="RTT-TRAINING">RTT - Training</option>
				<option value="PHYSICS">Physics</option>
				<option value="NWH-ATTENDING">MD - NWH Attending</option>
				</select>
			</td>
			<td>
			<div id="person_results"></div>
			<input type="hidden" name="hidden_person" id="hidden_person" value="">
			</td>
			<td><input type="text" name="start_date" id="start_date" size="10" maxlength="10" onblur="auto_days()" class="form-control"> 
			<script language="JavaScript" type="text/javascript">
	new tcal ({
		// form name
		\'formname\': \'add_oncall\',
		// input name
		\'controlname\': \'start_date\'
		
	}
	);	
	
	
              </script>
              </td>
			<td>
			<input type="text" name="end_date" id="end_date" size="10" maxlength="10" onfocus="auto_days();" class="form-control">
			<script language="JavaScript" type="text/javascript">
	new tcal ({
		// form name
		\'formname\': \'add_oncall\',
		// input name
		\'controlname\': \'end_date\'
	});
              </script>
			  <div id="end_date_text"></div>
			</td>
			<td><textarea cols="60" rows="1" id="comments" name="comments" class="form-control"></textarea></td>
			<td><input type="button" onclick="insert_record()" value="[+ Record]" class="btn btn-primary btn-block"></td>
		</tr>
  	</table>
	  </form></div>';
}

	  ?>
	  <script>
		 $( function() {
    $( "#start_date, #end_date" ).datepicker();
  } );
	  </script>
	  
	  
<div class="container-fluid" style="padding-bottom:1%;	">
  	<table width="100%" style="letter-spacing: 2px;">
  		<tr align="center">
			<td><a href="http://ppd.partners.org/scripts/phsweb.mwl?APP=PDPERS&ACTION=PAGE&ID=146330" target="new"><i class="fas fa-2x fa-pager" style="color:#97CC04;"></i><br>RTT - 30647</a></td>
			<td><a href="http://ppd.partners.org/scripts/phsweb.mwl?APP=PDPERS&ACTION=PAGE&ID=185276" target="new"><i class="fas fa-2x fa-pager" style="color:#EEB902;"></i><br>Resident -  21807</a></td>
			<td><a href="http://ppd.partners.org/scripts/phsweb.mwl?APP=PDPERS&ACTION=PAGE&ID=37533" target="new"><i class="fas fa-2x fa-pager" style= "color:#F45D01"></i><br>Physics - 30624</a></td>
			
		</tr>
	</table>
	  </div>	  
	  

		<div class="container float-left" style="width:40%; align-self:  left;" >
			<div class="row">
				<div class="col"><input type="button" value="My Schedule" class="btn btn-sm btn-outline-primary" onclick="myschedule('<?php echo $userid;?>');"></div>
				<div class="col"><input type="button" value="Past Assignments" class="btn btn-sm btn-outline-primary" onclick="past_records();"></div>
               
				<div class="col"><input type="button" value="Assignment Stats" class="btn btn-sm btn-outline-primary" onclick="stats();"></div>
			</div>
		</div>	  
	  	  
<div class="container-fluid" id="schedule_results" style="padding-top:3%;">

  	  	  	  	  <?php require('oncall_schedule.php'); ?>  	  	  	  	  

</div>  	  	  	  	  	  	  	  	  	   	  	  	  	  	  	  	  	  	  
	  	  	  	  	  

</div>















</body>
</html>
