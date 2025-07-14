<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db.php';

$tripType = $_GET['tripType'] ?? null;


function getFullAirportName($city) {
    $mapping = [
        '台北' => '台北桃園國際機場',
        '東京' => '東京成田國際機場',
        '大阪' => '大阪關西國際機場',
        '北海道' => '北海道新千歲機場',
        // 可自行補充更多
    ];
    return $mapping[$city] ?? $city;  // 找不到就回原本名字
}

// ──────────── 公用函式：根據航班資料加入艙等資訊 ────────────
$tripType = $_GET['tripType'] ?? null;

function enrichFlights($pdo, $flights) {
    $flightIds = array_column($flights, 'id');
    if (count($flightIds) === 0) return [];

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
                'city' => getFullAirportName($f['from_airport_name']),
                'time' => date('Y-m-d (H:i)', strtotime($f['departure_time']))
            ],
            'arrival' => [
                'city' => getFullAirportName($f['to_airport_name']),
                'time' => date('Y-m-d (H:i)', strtotime($f['arrival_time']))
            ],
            'direction' => $f['direction'],
            'center' => floor($f['duration'] / 60) . 'h ' . ($f['duration'] % 60) . 'm',
            'class_details' => $prices[$f['id']] ?? [],
        ];
    }

    return $output;
}
// ──────────── 來回行程查詢 ────────────
if ($tripType === 'round') {
    $departure1 = $_GET['departure1'] ?? null;
    $arrival1 = $_GET['arrival1'] ?? null;
    $departure2 = $_GET['departure2'] ?? null;
    $arrival2 = $_GET['arrival2'] ?? null;

    // 去程查詢
    $whereClauses1 = [];
    $params1 = [];
    if ($departure1) {
        $whereClauses1[] = "from_airport_name = :departure1";
        $params1[':departure1'] = $departure1;
    }
    if ($arrival1) {
        $whereClauses1[] = "to_airport_name = :arrival1";
        $params1[':arrival1'] = $arrival1;
    }
    $where1 = count($whereClauses1) > 0 
        ? "WHERE " . implode(' AND ', $whereClauses1) . " AND direction = 'outbound'"
        : "WHERE direction = 'outbound'";

    $stmt1 = $pdo->prepare("SELECT * FROM flights $where1 ORDER BY id ASC");
    $stmt1->execute($params1);
    $flightsGo = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // 回程查詢
    $whereClauses2 = [];
    $params2 = [];
    if ($departure2) {
        $whereClauses2[] = "from_airport_name = :departure2";
        $params2[':departure2'] = $departure2;
    }
    if ($arrival2) {
        $whereClauses2[] = "to_airport_name = :arrival2";
        $params2[':arrival2'] = $arrival2;
    }
    $where2 = count($whereClauses2) > 0 
        ? "WHERE " . implode(' AND ', $whereClauses2) . " AND direction = 'inbound'"
        : "WHERE direction = 'inbound'";

    $stmt2 = $pdo->prepare("SELECT * FROM flights $where2 ORDER BY id ASC");
    $stmt2->execute($params2);
    $flightsReturn = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'outbound' => enrichFlights($pdo, $flightsGo),
        'inbound' => enrichFlights($pdo, $flightsReturn),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ──────────── 單程查詢（同時取出去程和回程資料））────────────
$departure = $_GET['departure'] ?? null;
$arrival = $_GET['arrival'] ?? null;

$outboundFlights = [];
$inboundFlights = [];

if ($departure && $arrival) {
    // 去程
    $stmt1 = $pdo->prepare("
        SELECT * FROM flights
        WHERE from_airport_name = :departure AND to_airport_name = :arrival
        ORDER BY id ASC
    ");
    $stmt1->execute([':departure' => $departure, ':arrival' => $arrival]);
    $outboundFlights = $stmt1->fetchAll(PDO::FETCH_ASSOC);

    // 回程
    $stmt2 = $pdo->prepare("
        SELECT * FROM flights
        WHERE from_airport_name = :arrival AND to_airport_name = :departure
        ORDER BY id ASC
    ");
    $stmt2->execute([':arrival' => $arrival, ':departure' => $departure]);
    $inboundFlights = $stmt2->fetchAll(PDO::FETCH_ASSOC);
} else {
    // 如果只有 departure，取 outbound
    if ($departure) {
        $stmt = $pdo->prepare("
            SELECT * FROM flights 
            WHERE from_airport_name = :departure AND direction = 'outbound'
            ORDER BY id ASC
        ");
        $stmt->execute([':departure' => $departure]);
        $outboundFlights = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    // 如果只有 arrival，取 inbound
    if ($arrival) {
        $stmt = $pdo->prepare("
            SELECT * FROM flights
            WHERE from_airport_name = :arrival AND direction = 'inbound'
            ORDER BY id ASC
        ");
        $stmt->execute([':arrival' => $arrival]);
        $inboundFlights = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

echo json_encode([
    'outbound' => enrichFlights($pdo, $outboundFlights),
    'inbound' => enrichFlights($pdo, $inboundFlights),
], JSON_UNESCAPED_UNICODE);
exit;
?>
