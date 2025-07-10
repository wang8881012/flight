<!-- 航班搜尋API（帶條件） -->
<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db.php';

// 取得 GET 參數
$tripType = $_GET['tripType'] ?? null;
$departure = $_GET['departure'] ?? null;
$arrival = $_GET['arrival'] ?? null;

$whereClauses = [];
$params = [];

if ($departure) {
    $whereClauses[] = "from_airport_name = :departure";
    $params[':departure'] = $departure;
}
if ($arrival) {
    $whereClauses[] = "to_airport_name = :arrival";
    $params[':arrival'] = $arrival;
}

$where = count($whereClauses) > 0 ? "WHERE " . implode(' AND ', $whereClauses) : '';

$stmt = $pdo->prepare("SELECT * FROM flights $where ORDER BY id ASC");
$stmt->execute($params);
$flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

$flightIds = array_column($flights, 'id');
$classes = [];

if (count($flightIds) > 0) {
    $placeholders = implode(',', array_map(fn($i) => ":id$i", array_keys($flightIds)));
    $sql = "SELECT * FROM flight_classes WHERE flight_id IN ($placeholders) ORDER BY flight_id, price ASC";
    $stmt2 = $pdo->prepare($sql);

    foreach ($flightIds as $i => $id) {
        $stmt2->bindValue(":id$i", $id);
    }

    $stmt2->execute();
    $classes = $stmt2->fetchAll(PDO::FETCH_ASSOC);
}

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
        'departure' => [
            'city' => $f['from_airport_name'],
            'time' => date('H:i', strtotime($f['departure_time']))
        ],
        'arrival' => [
            'city' => $f['to_airport_name'],
            'time' => date('H:i', strtotime($f['arrival_time']))
        ],
        'direction' => $f['direction'],
        'center' => floor($f['duration'] / 60) . 'h ' . ($f['duration'] % 60) . 'm',
        'class_details' => $prices[$f['id']] ?? [],
        'buttons' => array_map(fn($p) => '$' . $p['price'], $prices[$f['id']] ?? [])
    ];
}

echo json_encode(['flights' => $output], JSON_UNESCAPED_UNICODE);

