<?php
session_start();
header('Content-Type: application/json');


// die(var_dump($_SESSION['passengerCount'], $_SESSION['searchResult']));
if (isset($_SESSION['searchResult']) && isset($_SESSION['passengerCount'])) {
    echo json_encode([
        'searchResult' => $_SESSION['searchResult'],
        'passengerCount' => $_SESSION['passengerCount']
    ]);
} else {
    echo json_encode(['error' => '查無資料']);
}