<?php
session_start();

// 測試數據 - 模擬 session 內容
$_SESSION['booking_id'] = 15;
$_SESSION['total_amount'] = 2500; // 測試金額
$_SESSION['booking_info'] = [
    'departure' => [
        'passenger' => 'BB',
        'route' => '台北(TPE) / 東京(NRT)',
        'time' => '2025-08-01 08:00 / 2025-08-01 12:00',
        'flight_no' => 'BR198',
        'seat' => '12A'
    ],
    'return' => [
        'passenger' => 'BB',
        'route' => '東京(NRT) / 台北(TPE)',
        'time' => '2025-08-10 18:00 / 2025-08-10 21:30',
        'flight_no' => 'BR197',
        'seat' => '15B'
    ]
];

require_once '../inc/db.inc.php';
require_once '../../vendor/autoload.php';

use Ecpay\Sdk\Factories\Factory;

// 檢查 session 中是否有訂單資訊
if (!isset($_SESSION['booking_id'], $_SESSION['total_amount'])) {
    die('訂單資訊不完整');
}

//將訂單資訊存入臨時表
$tempOrderId = uniqid();
//die(print($tempOrderId));

$stmt = $pdo->prepare("
    INSERT INTO temp_orders 
    (temp_id, booking_id, total_amount, booking_info, created_at) 
    VALUES (?, ?, ?, ?, NOW())
");
$stmt->execute([
    $tempOrderId,
    $_SESSION['booking_id'],
    $_SESSION['total_amount'],
    json_encode($_SESSION['booking_info'])
]);

$factory = new Factory([
    'hashKey' => 'pwFHCqoQZGmho4w6',
    'hashIv'  => 'EkRm7iFT261dpevs',
]);

$service = $factory->create('AutoSubmitFormWithCmvService');

$input = [
    'MerchantID'        => '3002607',                   // 商店代號
    'MerchantTradeNo'   => $tempOrderId,                // 訂單編號
    'MerchantTradeDate' => date('Y/m/d H:i:s'),         // 訂單時間
    'PaymentType'       => 'aio',                       // 交易類型 (固定值，表示使用「全方位金流」介面)
    'TotalAmount'       => $_SESSION['total_amount'],   // 金額
    'TradeDesc'         => '機票訂購',                   // 交易描述
    'ItemName'          => '機票',                       // 商品名稱
    'ChoosePayment'     => 'Credit',                    // 付款方式
    'EncryptType'       => 1,                           // 加密類型

    'ReturnURL'         => 'http://rnsfv-150-117-19-191.a.free.pinggy.link/flight/api/confirm/ecpay_return.php',
    'OrderResultURL'    => 'https://rnsfv-150-117-19-191.a.free.pinggy.link/flight/api/confirm/ecpay_return.php'
];

$action = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

echo $service->generate($input, $action);


//確保在進入支付流程前，session 中已設置了以下資訊：
// $_SESSION['booking_id'] = 11; // 或更大的值
// $_SESSION['total_amount'] = 1000; // 實際金額
// $_SESSION['booking_info'] = [/* 航班資訊等 */];

// 補充創建臨時資料庫的語法
// CREATE TABLE temp_orders (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     temp_id VARCHAR(50) NOT NULL,
//     booking_id INT NOT NULL,
//     total_amount INT NOT NULL,
//     booking_info TEXT NOT NULL,
//     created_at DATETIME NOT NULL,
//     INDEX (temp_id)
// );