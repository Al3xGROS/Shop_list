<?php

header("Access-Control-Allow-Origin: *");
header('Content-type: application/json; charset=utf-8');

$random_id = bin2hex(random_bytes(32));
$data = json_decode(file_get_contents('data.json'), true);
$courses = $data['courses'];
$seq = $data['sequence'];

$output = array(
    "id" => $random_id,
    "courses" => $courses, 
    "sequence" => $seq,
);

print(json_encode($output));

?>