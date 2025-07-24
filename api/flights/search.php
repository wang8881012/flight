<?php
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db.inc.php';

// 開發階段開啟錯誤顯示，正式上線可關閉
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 讀取 JSON 格式 POST 資料
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// 將接收到的參數存進 SESSION（方便跨頁使用）
$_SESSION['tripType'] = $input['tripType'] ?? 'round';
$_SESSION['startDate'] = $input['startDate'] ?? null;
$_SESSION['endDate'] = $input['endDate'] ?? null;
$_SESSION['departure1'] = $input['departure1'] ?? null;
$_SESSION['arrival1'] = $input['arrival1'] ?? null;
$_SESSION['departure2'] = $input['departure2'] ?? null;
$_SESSION['arrival2'] = $input['arrival2'] ?? null;
$_SESSION['departure'] = $input['departure'] ?? null;
$_SESSION['arrival'] = $input['arrival'] ?? null;

// 輔助函式：為航班加入艙等資訊
function enrichFlights($pdo, $flights) {
    $flightIds = array_column($flights, 'id');
    if (empty($flightIds)) return [];

    $placeholders = implode(',', array_fill(0, count($flightIds), '?'));
    $stmt = $pdo->prepare("SELECT * FROM flight_classes WHERE flight_id IN ($placeholders) ORDER BY flight_id, price ASC");
    $stmt->execute($flightIds);
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $prices = [];
    foreach ($classes as $c) {
        $prices[$c['flight_id']][] = [
            'class_type' => $c['class_type'],
            'price' => (int)$c['price'],
            'seats_available' => (int)$c['seats_available']
        ];
    }

    $output = [];
    foreach ($flights as $f) {
        $output[] = [
            'id' => $f['id'],
            'flight_no' => $f['flight_no'],
            'from_airport' => $f['from_airport'],
            'to_airport' => $f['to_airport'],
            'departure' => [
                'city' => $f['from_airport_name'],
                'time' => date('Y-m-d (H:i)', strtotime($f['departure_time']))
            ],
            'arrival' => [
                'city' => $f['to_airport_name'],
                'time' => date('Y-m-d (H:i)', strtotime($f['arrival_time']))
            ],
            'direction' => $f['direction'],
            'center' => floor($f['duration'] / 60) . 'h ' . ($f['duration'] % 60) . 'm',
            'class_details' => $prices[$f['id']] ?? [],
        ];
    }

    return $output;
}

// 查詢航班結果初始陣列
$outboundFlights = [];
$inboundFlights = [];

// 依 tripType 決定查詢邏輯
if ($_SESSION['tripType'] === 'round') {
    if ($_SESSION['departure1'] && $_SESSION['arrival1'] && $_SESSION['startDate']) {
        $stmt1 = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :departure1 
              AND to_airport_name = :arrival1 
              AND DATE(departure_time) = :startDate
            ORDER BY id ASC
        ");
        $stmt1->execute([
            ':departure1' => $_SESSION['departure1'],
            ':arrival1' => $_SESSION['arrival1'],
            ':startDate' => $_SESSION['startDate']
        ]);
        $outboundFlights = $stmt1->fetchAll(PDO::FETCH_ASSOC);
    }

    if ($_SESSION['departure2'] && $_SESSION['arrival2'] && $_SESSION['endDate']) {
        $stmt2 = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :departure2 
              AND to_airport_name = :arrival2 
              AND DATE(departure_time) = :endDate
            ORDER BY id ASC
        ");
        $stmt2->execute([
            ':departure2' => $_SESSION['departure2'],
            ':arrival2' => $_SESSION['arrival2'],
            ':endDate' => $_SESSION['endDate']
        ]);
        $inboundFlights = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    }

} elseif ($_SESSION['tripType'] === 'oneway') {
    if ($_SESSION['departure'] && $_SESSION['arrival'] && $_SESSION['startDate']) {
        $stmt = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :departure 
              AND to_airport_name = :arrival 
              AND DATE(departure_time) = :startDate
            ORDER BY id ASC
        ");
        $stmt->execute([
            ':departure' => $_SESSION['departure'],
            ':arrival' => $_SESSION['arrival'],
            ':startDate' => $_SESSION['startDate']
        ]);
        $outboundFlights = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// 輸出 JSON 格式航班資料
echo json_encode([
    'outbound' => enrichFlights($pdo, $outboundFlights),
    'inbound' => enrichFlights($pdo, $inboundFlights),
], JSON_UNESCAPED_UNICODE);
exit;
