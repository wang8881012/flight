<?php
session_start(); // 啟用 Session

// 讀取前端送來的 JSON 字串
$input = file_get_contents("php://input");
$data = json_decode($input, true); // 將 JSON 解成 PHP 陣列

// 檢查格式是否正確
if (!isset($data['selections']) || !is_array($data['selections'])) {
    echo json_encode([
        'success' => false,
        'message' => '資料格式錯誤，selections 不存在或不是陣列'
    ]);
    exit;
}

// 將資料儲存到 Session，使用不重複的名稱
$_SESSION['passenger_addons'] = $data['selections'];

echo json_encode([
    'success' => true,
    'message' => '乘客座位與加購資料已儲存到 Session'
]);