<?php
// flight/api/save_passenger.php
require_once __DIR__ . '/api_helper.php';

session_start();
// 輸入人數
$data = get_json_input();

$count = isset($data['count']) ? intval($data['count']) : 2;
$count = max(1, min($count, 4)); // 限制為 1~4 人

$_SESSION['passenger_count'] = $count;

send_json(['success' => true, 'count' => $count]);

$_SESSION['user_id'] = $_SESSION['user_id'] ?? 1;

$passenger_id = $_SESSION['user_id'];
$data = get_json_input();

if (!isset($data['first_name'], $data['last_name'])) {
    send_json(['error' => '缺少姓名欄位'], 400);
}

$passport_name = trim($data['first_name']) . "," . trim($data['last_name']);
$birthday = $data['birthday'] ?? '';
$nationality = $data['nationality'] ?? '';
$passport_number = $data['passport_number'] ?? '';
$passport_expiry = $data['passport_expiry'] ?? '';

$conn = db_connect();

$sql = "UPDATE passenger_info
        SET passport_name = ?, birthday = ?, nationality = ?, passport_number = ?, passport_expiry = ?
        WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $passport_name, $birthday, $nationality, $passport_number, $passport_expiry, $passenger_id);

if ($stmt->execute()) {
    send_json(['success' => true, 'message' => '資料已儲存']);
} else {
    send_json(['error' => '資料儲存失敗'], 500);
}
echo "<script>localStorage.setItem('passenger_count', $count);</script>";