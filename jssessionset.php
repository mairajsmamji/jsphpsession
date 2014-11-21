<?php

$session_path = session_save_path() . "/JSSESSION";

if(!file_exists($session_path))
    mkdir($session_path);
session_save_path($session_path);
ini_set('session.gc_probability', 1);
ini_set('session.gc_maxlifetime', 3600);
ini_set('session.cookie_lifetime', 0);
session_start();

$a = session_id();
if(empty($a)) {
	echo "error1";
	exit(0);
}

$jsid = $_GET['jsid'];
$cmd = $_GET['cmd'];
$key = $_GET['key'];
$val = $_GET['val'];

if($a != $jsid ||  empty($cmd)){
	echo "error2";
	exit(0);
} 

if($cmd == 'destroy'){
    session_unset();
    session_destroy();
    session_write_close();
    setcookie(session_name(),'',0,'/');
	echo "done";exit(0);
}

if($cmd == 'set' && !empty($val) && !empty($key)){
	$_SESSION[$key] = $val;
	$_SESSION['jslast'] = time();
} 
else if($cmd == 'unset' && !empty($key)){
	unset($_SESSION[$key]);
	$_SESSION['jslast'] = time();
} else {
	echo "error3";
	exit(0);
}

echo "done";
?>


