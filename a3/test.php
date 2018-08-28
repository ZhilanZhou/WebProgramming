<?PHP

$user_name = "zzl@classroom.cs.unc.edu";
$password = "yy950706";
$database = "zzldb";
$server = "classroom.cs.unc.edu";

$db_handle = mysql_connect($server, $user_name, $password);

$db_found = mysql_select_db($database, $db_handle);

if ($db_found) {

    print "Database Found ";
    mysql_close($db_handle);

}
else {

    print "Database NOT Found ";

}


?>