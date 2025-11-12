<?php 
class LogFuncs {  
    public $logFileName;
    public function __construct() {
        $currentFileName = basename($_SERVER['PHP_SELF']);
        $this->logFileName = "H:\\inetpub\\logs\\fjl_logs\\" . $currentFileName . "_log.txt";
        $this->logMessage("Script started");
        
        }
    public function logMessage($message = '') {
        $timestamp = date("Y-m-d H:i:s");
        $message = isset($message) ? $message : '';
        error_log("[$timestamp] $message\n", 3, $this->logFileName);
    }

}

?>
