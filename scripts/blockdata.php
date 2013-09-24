<?php 
header("Content-Type: application/json", true);

function get_data($url) {
    $ch = curl_init();
    $timeout = 5;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

$array = array(
    "currentblock" => get_data("http://blockexplorer.com/q/getblockcount"),
    "endofblockchain" => get_data("http://blockexplorer.com/q/nextretarget")
);

print_r(json_encode($array));

?>
