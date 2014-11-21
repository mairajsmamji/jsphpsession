<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$session_path = session_save_path() . "/JSSESSION";
if(!file_exists($session_path))
    mkdir($session_path);
session_save_path($session_path);
ini_set('session.gc_probability', 1);
ini_set('session.gc_maxlifetime', 3600);
ini_set('session.cookie_lifetime', 0);


session_start();

$_SESSION['jsid'] = session_id();

echo "data:".json_encode($_SESSION) ."\n\n";
flush();
?>
