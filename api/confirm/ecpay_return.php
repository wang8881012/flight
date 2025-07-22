<?php
require_once __DIR__ . '/../inc/db.inc.php';

// 綠界付款結果回傳格式範例
// $_POST = [
//     'MerchantID'           => '3002607',
//     'MerchantTradeNo'      => 'WPLL4E341E122DB44D62',
//     'PaymentDate'          => '2019/05/09 00:01:21',
//     'PaymentType'          => 'Credit_CreditCard',
//     'PaymentTypeChargeFee' => '1',
//     'RtnCode'              => '1',
//     'RtnMsg'               => '交易成功',
//     'SimulatePaid'         => '0',
//     'TradeAmt'             => '500',
//     'TradeDate'            => '2019/05/09 00:00:18',
//     'TradeNo'              => '1905090000188278',
//     'CheckMacValue'        => '6E7F053EF215FC851A050A2FF01D72CBE440EA138DC3E905647985DDF236FD25',
// ];

// 從POST請求中獲取綠界支付回傳的參數
$merchantTradeNo = $_POST['MerchantTradeNo'] ?? '';
$rtnCode = $_POST['RtnCode'] ?? '';
$tradeAmt = $_POST['TradeAmt'] ?? 0;
$paymentDate = $_POST['PaymentDate'] ?? date('Y-m-d H:i:s');
$tradeNo = $_POST['TradeNo'] ?? '';

// 根據RtnCode確定支付狀態
$status = ($rtnCode == '1') ? 'success' : 'fail';

try {
    // 先獲取當前最大的 booking_id
    $stmt = $pdo->query("SELECT MAX(booking_id) as max_id FROM payments");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $currentMaxId = $result['max_id'] ?? 10; // 如果沒有記錄，從10開始，下一筆就是11

    // 計算下一個 booking_id (確保至少從11開始)
    $nextBookingId = max(11, $currentMaxId + 1);

    // 準備SQL語句插入支付記錄
    $stmt = $pdo->prepare("
        INSERT INTO payments (
            booking_id, 
            amount, 
            paid_at, 
            method, 
            status, 
            transaction_id
        ) VALUES (
            :booking_id, 
            :amount, 
            :paid_at, 
            :method, 
            :status, 
            :transaction_id
        )
    ");

    // 執行插入操作
    $stmt->execute([
        ':booking_id' => $nextBookingId,
        ':amount' => $tradeAmt,
        ':paid_at' => $paymentDate,
        ':method' => 'creditcard', // 固定值
        ':status' => $status,
        ':transaction_id' => $tradeNo
    ]);

    // 獲取剛插入的記錄ID
    $paymentId = $pdo->lastInsertId();

    // 記錄日誌以備查詢
    $logStmt = $pdo->prepare('INSERT INTO apilog (`request`, `response`) VALUES (:request, :response)');
    $logStmt->execute([
        ':request' => json_encode($_POST, JSON_UNESCAPED_UNICODE),
        ':response' => json_encode([
            'status' => 'payment_record_created', 
            'payment_id' => $paymentId,
            'booking_id' => $nextBookingId
        ], JSON_UNESCAPED_UNICODE)
    ]);

    http_response_code(200);
    echo json_encode([
        'status' => 'success', 
        'message' => 'Payment record created successfully',
        'payment_id' => $paymentId,
        'booking_id' => $nextBookingId
    ]);

} catch (PDOException $e) {
    // 錯誤處理
    error_log('Payment record creation failed: ' . $e->getMessage());
}