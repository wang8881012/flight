<?php
// flight/api/get_passenger.php
require_once __DIR__ . '/api_helper.php';

session_start();

// 模擬登入（正式版記得移除）
$_SESSION['user_id'] = $_SESSION['user_id'] ?? 1;

$passenger_id = $_SESSION['user_id'];

$conn = db_connect();

$sql = "SELECT passport_name, birthday, nationality, passport_number, passport_expiry
        FROM passenger_info
        WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $passenger_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // 拆名字
    list($first_name, $last_name) = explode(',', $row['passport_name'] . ',');

    send_json([
        'first_name' => $first_name,
        'last_name' => $last_name,
        'birthday' => $row['birthday'],
        'nationality' => $row['nationality'],
        'passport_number' => $row['passport_number'],
        'passport_expiry' => $row['passport_expiry']
    ]);
} else {
    send_json(['error' => '找不到乘客資料'], 404);
}
