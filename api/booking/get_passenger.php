<?php
// flight/api/get_passenger.php
require_once __DIR__ . '/api_helper.php';

session_start();
$_SESSION = []; //正式版需刪除
// 取得乘客人數
$count = $_SESSION['passenger_count'] ?? 3;

send_json(['success' => true, 'count' => $count]);
// 模擬登入（正式版記得移除）
// $_SESSION['user_id'] = $_SESSION['user_id'] ?? 1;

$passenger_id = $_SESSION['user_id'];

$conn = db_connect();

$sql = "SELECT passport_first_name, passport_last_name, birthday, nationality, passport_number, passport_expiry, gender
        FROM users
        WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $passenger_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();

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
