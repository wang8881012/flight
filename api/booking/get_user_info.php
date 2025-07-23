<?php
// flight-2/api/booking/get_user_info.php
require_once __DIR__ . '/api_helper.php'; // ← 根據實際目錄做調整

session_start();

// 測試期間使用 user_id = 1，日後改回 session
$user_id = $_SESSION['user_id'] ?? 1;

if (!$user_id) {
    send_json(['error' => '尚未登入會員'], 401);
}

$conn = db_connect();

$sql = "SELECT passport_first_name, passport_last_name, email, birthday, phone, gender, passport_number, nationality, passport_expiry
        FROM users
        WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    send_json(['error' => 'SQL 預處理失敗', 'sql_error' => $conn->error], 500);
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    send_json([
        'success' => true,
        'user' => $row
    ]);
} else {
    send_json(['error' => '找不到會員資料'], 404);
}
