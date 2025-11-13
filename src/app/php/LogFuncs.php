<?php 
include('H:\inetpub\lib\phpDB.inc');
require_once 'H:\inetpub\lib\sqlsrvLibFL.php';
class LogFuncs {  
    private $logFileName;
    private $handle;
    public function __construct() {
        $this->handle = connectDB_FL();
        $currentFileName = basename($_SERVER['PHP_SELF']);
        $this->logFileName = "H:\\inetpub\\logs\\fjl_logs\\" . $currentFileName . "_log.txt";
        $this->logMessage("Script started");
        
        }
    public function logMessage($message = '') {
        $timestamp = date("Y-m-d H:i:s");
        $message = isset($message) ? $message : '';
        error_log("[$timestamp] $message\n", 3, $this->logFileName);
    }
    public function logSql($sqlStr) {
        $stmt = sqlsrv_prepare($this->handle, $sqlStr);
        if ($stmt === false) {
            $dstr = print_r(sqlsrv_errors(), true);
            $this->logMessage("Error preparing statement: ". $dstr);
        }
        if (sqlsrv_execute($stmt) === false) {
            $dstr = print_r(sqlsrv_errors(), true);
            $this->logMessage("Error executing statement: ". $dstr);
        }
        else
            {
            $this->logMessage($sqlStr);
            sqlsrv_free_stmt($stmt);
            sqlsrv_close($this->handle);
        } 
            
    }

}

?>
