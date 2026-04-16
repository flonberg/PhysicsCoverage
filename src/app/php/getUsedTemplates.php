<?php
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
require_once 'H:\inetpub\lib\LogFuncs.php';
$handle = connectDB_FL();
   $log = new LogFuncs();
   $templates = Array();
   $selStr = "SELECT  DISTINCT templateidx FROM [imrt].[dbo].[WWDdocuments] where uploadDate > '2025-01-01' AND  order by templateidx";
    $stmt = sqlsrv_query( $handle, $selStr);
    if( $stmt === false ) 
        { return ""; } 
     $temp = array();
     while($row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC)){
        $selStr2 = "SELECT userkey FROM [imrt].[dbo].[WWDmenus] where templateidx = ".$row['templateidx'];
        $stmt2 = sqlsrv_query( $handle, $selStr2);
        if( $stmt2 === false )
            { return ""; }  
        while ($row2 = sqlsrv_fetch_array( $stmt2, SQLSRV_FETCH_ASSOC)) {
        //    echo "<br>"; var_dump($row2);
            if ($templates[$row2['userkey']] == NULL)
                $templates[$row2['userkey']] = Array();
            array_push($templates[$row2['userkey']], $row['templateidx']);
            
            }
        }
echo "templates used <pre>"; print_r($templates); echo "</pre>";
     
     $log->logMessage("Retrieved template data: ". print_r($temp, true));
     $ret = json_encode($temp);
     echo $ret;