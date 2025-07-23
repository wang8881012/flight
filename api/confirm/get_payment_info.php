<?php
session_start();

// 返回 JSON 格式
header('Content-Type: application/json');

// 從 session 獲取支付和訂單資訊
$response = [
    'payment_info' => $_SESSION['payment_info'] ?? null,
    'booking_info' => $_SESSION['booking_info'] ?? null
];

echo json_encode($response);

// 清除不再需要的 session 數據
//unset($_SESSION['payment_info']);