<?php
require_once __DIR__ . '/api_helper.php';   // ★ 依你的結構調整

$conn = db_connect();

$sql = "SELECT id, name, price 
        FROM addons 
        WHERE type = 'meal' AND is_deleted = 0
        ORDER BY id";
$result = $conn->query($sql);

$meals = [];
while ($row = $result->fetch_assoc()) {
    $meals[] = $row;         // 每筆格式：["id"=>1, "name"=>"vegetarian", ...]
}

send_json([
    'status' => 'success',
    'data'   => $meals
]);
