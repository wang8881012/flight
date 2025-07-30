<?php
session_start();

// 取得傳入的 JSON 資料
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// 檢查格式是否正確
if (!isset($data['selections']) || !is_array($data['selections'])) {
    echo json_encode(['success' => false, 'message' => '格式錯誤']);
    exit;
}

// 儲存至 session
$_SESSION['seat_selections'] = $data['selections'];

// 回傳成功訊息
echo json_encode(['success' => true]);
