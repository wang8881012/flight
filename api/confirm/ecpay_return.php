<?php
session_start();
require '../inc/db.inc.php';

// 記錄接收到的 POST 資料
file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - POST: " . print_r($_POST, true) . "\n", FILE_APPEND);
file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - SESSION: " . print_r($_SESSION, true) . "\n", FILE_APPEND);

// 檢查資料庫連接
try {
    $pdo->query("SELECT 1");
    file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - 資料庫連接正常\n", FILE_APPEND);
} catch (PDOException $e) {
    file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - 資料庫連接失敗: " . $e->getMessage() . "\n", FILE_APPEND);
    die('資料庫連接失敗');
}

// 從 MerchantTradeNo 獲取 temp_id
$tempId = $_POST['MerchantTradeNo'];

// 從臨時資料表查詢訂單資訊
$stmt = $pdo->prepare("SELECT * FROM temp_orders WHERE temp_id = ?");
$stmt->execute([$tempId]);
$order = $stmt->fetch();

if ($order) {
    $_SESSION['booking_id'] = $order['booking_id'];
    $_SESSION['total_amount'] = $order['total_amount'];
    $_SESSION['booking_info'] = json_decode($order['booking_info'], true);
    
    // 刪除臨時記錄
    $pdo->prepare("DELETE FROM temp_orders WHERE temp_id = ?")->execute(['temp_' . $tempId]);
}

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

// 只檢查必要參數
if (!isset($_POST['RtnCode'], $_POST['MerchantTradeNo'], $_POST['TradeAmt'])) {
    die('參數錯誤');
}

// 支付成功才處理
if ($_POST['RtnCode'] == '1') {

    //繞過 session 丟失問題的測試數據 (綠界回傳的時候 session 紀錄會完全丟失)
    // $_SESSION['booking_id'] = 11;
    // $_SESSION['total_amount'] = 1000;
    // $_SESSION['booking_info'] = [
    //     'departure' => [
    //         'passenger' => '測試用戶',
    //         'route' => 'TPE/KIX',
    //         'time' => '2025-01-01 08:00/12:00',
    //         'flight_no' => 'TEST123',
    //         'seat' => '1A'
    //     ],
    //     'return' => [
    //         'passenger' => '測試用戶',
    //         'route' => 'KIX/TPE',
    //         'time' => '2025-01-10 18:00/21:00',
    //         'flight_no' => 'TEST456',
    //         'seat' => '2B'
    //     ]
    // ];

    try {
        // 檢查 session 中是否有 booking_id
        if (!isset($_SESSION['booking_id'])) {
            throw new Exception('缺少訂單資訊 - SESSION: ' . print_r($_SESSION, true));
        }

        // 確保 booking_id ≥ 11
        $bookingId = max(11, $_SESSION['booking_id']);
        $amount = intval($_POST['TradeAmt']);
        $tradeNo = $_POST['TradeNo'];

        file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - 準備插入資料: booking_id=$bookingId, amount=$amount, trade_no=$tradeNo\n", FILE_APPEND);

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
                NOW(), 
                'creditcard', 
                'success', 
                :trade_no
            )
        ");

        $stmt->execute([
            ':booking_id' => $bookingId,
            ':amount'    => $amount,
            ':trade_no'  => $tradeNo
        ]);

        // 檢查是否成功插入
        $lastId = $pdo->lastInsertId();
        if ($lastId) {
            file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - 成功插入資料，ID: $lastId\n", FILE_APPEND);
        } else {
            file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - 插入資料失敗\n", FILE_APPEND);
        }

        // 儲存交易資訊到 session 供 complete.html 使用
        $_SESSION['payment_info'] = [
            'status' => 'success',
            'order_id' => $bookingId,
            'amount' => $amount,
            'transaction_id' => $tradeNo
        ];

        // 跳轉到完成頁面
        header("Location: ../../public/complete.html");
        exit;
        
    } catch (Exception $e) {
        file_put_contents('ecpay_debug.log', date('Y-m-d H:i:s') . " - 發生異常: " . $e->getMessage() . "\n", FILE_APPEND);
        $_SESSION['payment_info'] = ['status' => 'error', 'message' => $e->getMessage()];
        header("Location: ../../public/complete.html");
        exit;
    }
}

//支付失敗也跳轉
$_SESSION['payment_info'] = ['status' => 'fail'];
header("Location: ../../public/complete.html");
exit;
