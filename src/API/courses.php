<?php

header("Access-Control-Allow-Origin: *");
header('Content-type: application/json; charset=utf-8');

$file = file_get_contents('data.json');
$data = json_decode($file, true);

$received_courses = json_decode($_POST['chg'], true);

foreach ($received_courses as $received_course) {
    $found = false;
    foreach ($data['courses'] as &$existing_course) {
        if ($existing_course['produit'] == $received_course['produit']) {
            $existing_course['qte'] = intval($existing_course['qte']) + intval($received_course['qte']);
            $found = true;
            break;
        }
    }
    if (!$found) {
        $data['courses'][] = $received_course;
    }
}

$data['sequence'] = intval($data['sequence']) + 1;

file_put_contents('data.json', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

?>