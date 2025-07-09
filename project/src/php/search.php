<?php
header('Content-Type: application/json');

// 資料庫設定
$host = 'localhost';
$dbname = 'plane';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM flights ORDER BY id ASC");
    $flightRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtClasses = $pdo->query("SELECT * FROM flight_classes ORDER BY flight_id ASC, price ASC");
    $classRows = $stmtClasses->fetchAll(PDO::FETCH_ASSOC);

    $pricesByFlight = [];
    foreach ($classRows as $class) {
        $pricesByFlight[$class['flight_id']][] = [
            'class_type' => $class['class_type'],
            'price' => (int)$class['price'],
            'seats_available' => (int)$class['seats_available']
        ];
    }

    $flights = [];
    foreach ($flightRows as $row) {
        $flightId = $row['id'];
        $durationMins = (int)$row['duration'];
        $flights[] = [
            'id' => $flightId,
            'flight_no' => $row['flight_no'],
            'departure' => [
                'city' => $row['from_airport_name'],
                'time' => date('H:i', strtotime($row['departure_time']))
            ],
            'arrival' => [
                'city' => $row['to_airport_name'],
                'time' => date('H:i', strtotime($row['arrival_time']))
            ],
            'center' => floor($durationMins / 60) . 'h ' . ($durationMins % 60) . 'm',
            'direction' => $row['direction'],
            'buttons' => array_map(fn($p) => '$' . $p['price'], $pricesByFlight[$flightId] ?? []),
            'class_details' => $pricesByFlight[$flightId] ?? []
        ];
    }

    echo json_encode(['flights' => $flights], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode(['error' => '資料庫錯誤', 'message' => $e->getMessage()]);
}


?>
