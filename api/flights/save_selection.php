<?php
session_start();
header('Content-Type: application/json');

// 這支只處理「把使用者在 search.html 選的航班」存進 session
$input = json_decode(file_get_contents('php://input'), true);

try {
    $tripType = $input['tripType'] ?? 'oneway';
    $selectedFlights = $input['selectedFlights'] ?? [];
    $totalPrice = $input['totalPrice'] ?? 0;
    $passengerCount = $input['passengerCount'] ?? ($_SESSION['passengerCount'] ?? 1);

    // 不覆蓋原本在 session 裡的 search 參數，只補上使用者最後選擇
    $_SESSION['selectedFlights'] = [
        'tripType' => $tripType,
        'outbound' => $selectedFlights['outbound'] ?? null,
        'inbound'  => $selectedFlights['inbound'] ?? null,
        'oneway'   => $selectedFlights['oneway'] ?? null,
        'passengerCount' => $passengerCount,
        'totalPrice' => $totalPrice
    ];

        echo json_encode([
        'status' => 'success',
        'savedData' => $_SESSION['selectedFlights']
    ]);
} catch (Throwable $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
