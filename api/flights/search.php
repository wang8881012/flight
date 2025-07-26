<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db.inc.php';

// 讀取 JSON 格式 POST 資料
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// 將接收到的參數存進 SESSION（方便跨頁使用）
$_SESSION['tripType'] = $input['tripType'] ?? 'round';
$_SESSION['startDate'] = $input['startDate'] ?? null;
$_SESSION['endDate'] = $input['endDate'] ?? null;
//去程
$_SESSION['departure1'] = $input['departure1'] ?? null;
$_SESSION['arrival1'] = $input['arrival1'] ?? null;
$_SESSION['departure2'] = $input['departure2'] ?? null;
$_SESSION['arrival2'] = $input['arrival2'] ?? null;
//單程
$_SESSION['departure'] = $input['departure'] ?? null;
$_SESSION['arrival'] = $input['arrival'] ?? null;
$_SESSION['passengerCount'] = $input['passengerCount'] ?? $_SESSION['passengerCount'] ?? 1;

// die(print_r($_SESSION));

$tripType = $_SESSION['tripType'];

if ($tripType === 'oneway') {
    // 單程查詢

    $departure = $_SESSION['departure'];
    $arrival = $_SESSION['arrival'];
    $date = $_SESSION['startDate'];
    $sql = "SELECT f.*, fc.class_type, fc.price, fc.seats_available
            FROM flights f
            JOIN flight_classes fc ON f.id = fc.flight_id
            WHERE f.from_airport_name = ? AND f.to_airport_name = ?
              AND DATE(f.departure_time) = ?
              AND f.is_deleted = 0
              AND f.direction = 'outbound'";
    
    $params = [$departure, $arrival, $date];
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // die(print_r($flights));

} elseif ($tripType === 'round') {
    // 去程查詢
    $departure1 = $_SESSION['departure1'];
    $arrival1 = $_SESSION['arrival1'];
    $startDate = $_SESSION['startDate'];

    $sql_outbound = "SELECT f.*, fc.class_type, fc.price, fc.seats_available
                     FROM flights f
                     JOIN flight_classes fc ON f.id = fc.flight_id
                     WHERE f.from_airport_name = ? AND f.to_airport_name = ?
                       AND DATE(f.departure_time) = ?
                       AND f.is_deleted = 0
                       AND f.direction = 'outbound'";
    
    $params_outbound = [$departure1, $arrival1, $startDate];

    // 回程查詢
    $departure2 = $_SESSION['departure2'];
    $arrival2 = $_SESSION['arrival2'];
    $endDate = $_SESSION['endDate'];

    $sql_inbound = "SELECT f.*, fc.class_type, fc.price, fc.seats_available
                    FROM flights f
                    JOIN flight_classes fc ON f.id = fc.flight_id
                    WHERE f.from_airport_name = ? AND f.to_airport_name = ?
                      AND DATE(f.departure_time) = ?
                      AND f.is_deleted = 0
                      AND f.direction = 'inbound'";
    
    $params_inbound = [$departure2, $arrival2, $endDate];
    $stmt_out = $pdo->prepare($sql_outbound);
    $stmt_out->execute($params_outbound);
    $outboundFlights = $stmt_out->fetchAll(PDO::FETCH_ASSOC);

    $stmt_in = $pdo->prepare($sql_inbound);
    $stmt_in->execute($params_inbound);
    $inboundFlights = $stmt_in->fetchAll(PDO::FETCH_ASSOC);
    // die(var_dump($outboundFlights, $inboundFlights));
}



if ($tripType === 'oneway') {
    // 回傳單程
    $result = ['flights' => $flights];
} else {
    // 回傳來回
    $result = [
        'outbound' => $outboundFlights,
        'inbound' => $inboundFlights
    ];
}

// die(var_dump($result));
$_SESSION['searchResult'] = $result;
if (isset($_SESSION['searchResult'])) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["error" => "查無搜尋結果"]);
}



