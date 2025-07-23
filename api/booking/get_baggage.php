<?php
require_once __DIR__ . '/api_helper.php';   // ★ 同上

$conn = db_connect();

$sql = "SELECT id, name, price 
        FROM addons 
        WHERE type = 'baggage' AND is_deleted = 0
        ORDER BY price";
$result = $conn->query($sql);

$baggage = [];
while ($row = $result->fetch_assoc()) {
    $baggage[] = $row;       // 格式同上
}

send_json([
    'status' => 'success',
    'data'   => $baggage
]);
