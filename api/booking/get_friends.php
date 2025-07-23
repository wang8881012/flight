<?php
// flight-2/api/booking/get_friends.php
require_once __DIR__ . '/api_helper.php';

session_start();

$user_id = $_SESSION['user_id'] ?? 1; // 測試用
if (!$user_id) {
    send_json(['error' => '尚未登入'], 401);
}
$conn = db_connect();

// 根據 saved_passengers 查找對應的旅客
$sql = "SELECT p.*
    FROM saved_passengers sp
    JOIN passenger_info p ON p.id = sp.id
    WHERE sp.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$friends = [];
while ($row = $result->fetch_assoc()) {
    $friends[] = $row;
}

send_json(['success' => true, 'friends' => $friends]);
