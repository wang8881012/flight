<?php
// flight-2/api/booking/get_friend_by_id.php
require_once __DIR__ . '/api_helper.php';

$conn = db_connect();

// 驗證並取得 id 參數
$friend_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$friend_id) {
    send_json(['error' => '缺少或錯誤的 ID'], 400);
}

// 查詢該位 passenger
$sql = "SELECT * FROM passenger_info WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $friend_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    send_json(['success' => true, 'friend' => $row]);
} else {
    send_json(['error' => '找不到該旅客'], 404);
}
