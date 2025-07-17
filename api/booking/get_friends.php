<?php
// flight-2/api/booking/get_friends.php
require_once __DIR__ . '/api_helper.php';

session_start();

$user_id = $_SESSION['user_id'] ?? 1; // 測試用

$conn = db_connect();

// 假設有一張 friend_list (user_id, friend_id)
// $sql = "SELECT p.*
//     FROM passenger_info p
//     JOIN users u ON u.id = p.user_id
//     WHERE u.id = ?;
$sql ="SELECT * FROM passenger_info WHERE user_id != ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$friends = [];
while ($row = $result->fetch_assoc()) {
    $friends[] = $row;
}

send_json(['success' => true, 'friends' => $friends]);
