<?php
// 這裡是ecpay回傳的資料，設計成API端點，好讓complete.js去fetch
header('Content-Type: application/json');
session_start();

require __DIR__ . '/../inc/db.inc.php';
require __DIR__ . '/../../vendor/autoload.php';

use Ecpay\Sdk\Factories\Factory;
//use Ecpay\Sdk\Services\CheckoutResponse;

// 獲取基本資料
$bookingId = $_GET['booking_id'] ?? 0;
$ecpayData = $_POST;

if (!$bookingId) {
    http_response_code(400);
    echo json_encode(['error' => '缺少 booking_id']);
    exit;
}

// 初始化 ECPay 驗證
$ecpay = new Factory([
    'hashKey' => 'pwFHCqoQZGmho4w6',
    'hashIv'  => 'EkRm7iFT261dpevs',
]);

try {
    $checkout = $ecpay->create('CheckoutResponse');

    if (!$checkout->validate($ecpayData)) {
        throw new Exception('ECPay 驗證失敗');
    }

    // 3. 檢查是否已處理過
    $checkStmt = $pdo->prepare("SELECT id FROM payments WHERE transaction_id = ?");
    $checkStmt->execute([$ecpayData['TradeNo'] ?? '']);

    if (!$checkStmt->fetch()) {
        // 4. 新增付款記錄
        $insertStmt = $pdo->prepare("
            INSERT INTO payments SET
                booking_id = ?,
                amount = ?,
                paid_at = NOW(),
                method = 'creditcard',
                status = ?,
                transaction_id = ?
        ");

        $isSuccess = ($ecpayData['RtnCode'] ?? '0') == '1';
        $insertStmt->execute([
            $bookingId,
            $ecpayData['TradeAmt'] ?? 0,
            $isSuccess ? 'success' : 'fail',
            $ecpayData['TradeNo'] ?? ''
        ]);
    }

    // 5. 獲取訂單資料
    $orderStmt = $pdo->prepare("
        SELECT 
            b.order_no,
            b.total_price,
            fd.flight_number AS depart_flight_no,
            fd.departure_airport AS depart_from,
            fd.arrival_airport AS depart_to,
            fd.departure_time AS depart_time,
            fd.arrival_time AS depart_arrival,
            fr.flight_number AS return_flight_no,
            fr.departure_airport AS return_from,
            fr.arrival_airport AS return_to,
            fr.departure_time AS return_time,
            fr.arrival_time AS return_arrival
        FROM booking b
        LEFT JOIN flight_classes fc_d ON b.class_depart_id = fc_d.id
        LEFT JOIN flights fd ON fc_d.flight_id = fd.id
        LEFT JOIN flight_classes fc_r ON b.class_return_id = fc_r.id
        LEFT JOIN flights fr ON fc_r.flight_id = fr.id
        WHERE b.id = ?
    ");
    $orderStmt->execute([$bookingId]);
    $orderData = $orderStmt->fetch(PDO::FETCH_ASSOC);

    if (!$orderData) {
        throw new Exception('訂單不存在');
    }

    // 6. 返回 JSON 格式資料
    echo json_encode([
        'success' => true,
        'order' => $orderData,
        'payment_status' => $isSuccess ? 'success' : 'fail'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
