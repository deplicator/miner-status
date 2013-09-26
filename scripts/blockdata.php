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
    "currentdifficulty" => get_data("http://blockexplorer.com/q/getdifficulty"),
    "currentend" => get_data("http://blockexplorer.com/q/nextretarget"),
    "currentblock" => get_data("http://blockexplorer.com/q/getblockcount"),
    "estimateddifficulty" => get_data("http://blockexplorer.com/q/estimate"),
    "estimatedtime" => get_data("http://blockexplorer.com/q/eta")
);

print_r(json_encode($array));

?>
