<?php
// flight/api/save_passenger.php
require_once __DIR__ . '/api_helper.php';
// 設定回傳 JSON
header('Content-Type: application/json');
$conn = db_connect(); 
// 初始化回傳資料
$response = [
    'success' => true,
    'outbound' => null,
    'inbound' => null
];

// 撈去程（outbound）
$sql_out = "SELECT from_airport, to_airport, departure_time, arrival_time FROM flights WHERE direction = 'outbound' LIMIT 1";
$result_out = $conn->query($sql_out);
if ($result_out && $result_out->num_rows > 0) {
    $response['outbound'] = $result_out->fetch_assoc();
}

// 撈回程（inbound）
$sql_in = "SELECT from_airport, to_airport, departure_time, arrival_time FROM flights WHERE direction = 'inbound' LIMIT 1";
$result_in = $conn->query($sql_in);
if ($result_in && $result_in->num_rows > 0) {
    $response['inbound'] = $result_in->fetch_assoc();
}

echo json_encode($response);