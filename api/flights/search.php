<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db.inc.php';

// 取得查詢參數
$tripType = $_GET['tripType'] ?? 'round';
$startDate = $_GET['startDate'] ?? null;
$endDate = $_GET['endDate'] ?? null;
$departure1 = $_GET['departure1'] ?? null;
$arrival1 = $_GET['arrival1'] ?? null;
$departure2 = $_GET['departure2'] ?? null;
$arrival2 = $_GET['arrival2'] ?? null;
$departure = $_GET['departure'] ?? null;
$arrival = $_GET['arrival'] ?? null;

// 加入艙等資訊
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

// 查詢航班
$outboundFlights = [];
$inboundFlights = [];

if ($tripType === 'round') {
    if ($departure1 && $arrival1 && $startDate) {
        $stmt1 = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :departure1 
              AND to_airport_name = :arrival1 
              AND DATE(departure_time) = :startDate
            ORDER BY id ASC
        ");
        $stmt1->execute([
            ':departure1' => $departure1,
            ':arrival1' => $arrival1,
            ':startDate' => $startDate
        ]);
        $outboundFlights = $stmt1->fetchAll(PDO::FETCH_ASSOC);
    }

    if ($departure2 && $arrival2 && $endDate) {
        $stmt2 = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :departure2 
              AND to_airport_name = :arrival2 
              AND DATE(departure_time) = :endDate
            ORDER BY id ASC
        ");
        $stmt2->execute([
            ':departure2' => $departure2,
            ':arrival2' => $arrival2,
            ':endDate' => $endDate
        ]);
        $inboundFlights = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    }

} elseif ($tripType === 'oneway') {
    if ($departure && $arrival && $startDate) {
        $stmt = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :departure 
              AND to_airport_name = :arrival 
              AND DATE(departure_time) = :startDate
            ORDER BY id ASC
        ");
        $stmt->execute([
            ':departure' => $departure,
            ':arrival' => $arrival,
            ':startDate' => $startDate
        ]);
        $outboundFlights = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// 輸出結果
echo json_encode([
    'outbound' => enrichFlights($pdo, $outboundFlights),
    'inbound' => enrichFlights($pdo, $inboundFlights),
], JSON_UNESCAPED_UNICODE);
exit;
