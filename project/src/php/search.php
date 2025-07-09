<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'plane';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 取得 GET 參數
    $tripType = $_GET['tripType'] ?? null;
    $departure = $_GET['departure'] ?? null;
    $arrival = $_GET['arrival'] ?? null;
    
error_log( "tripType = " . $tripType);
error_log( "departure = " . $departure);
error_log("arrival = " . $arrival);
    // 動態建立 WHERE 條件
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

    $where = '';
    if (count($whereClauses) > 0) {
        $where = "WHERE " . implode(' AND ', $whereClauses);
    }

    // 查詢航班
    $stmt = $pdo->prepare("SELECT * FROM flights $where ORDER BY id ASC");
    $stmt->execute($params);
    $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 取出符合條件航班的 ID
    $flightIds = array_column($flights, 'id');

    // 查詢艙等與價格
    if (count($flightIds) > 0) {
        $placeholders = implode(',', array_map(fn($i) => ":id$i", array_keys($flightIds)));
        $sql = "SELECT * FROM flight_classes WHERE flight_id IN ($placeholders) ORDER BY flight_id, price ASC";
        $stmt2 = $pdo->prepare($sql);

        $params2 = [];
        foreach ($flightIds as $i => $id) {
            $params2[":id$i"] = $id;
        }
        $stmt2->execute($params2);
        $classes = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $classes = [];
    }

    // 整理艙等價格資料
    $prices = [];
    foreach ($classes as $c) {
        $prices[$c['flight_id']][] = [
            'class_type' => $c['class_type'],
            'price' => (int)$c['price'],
            'seats_available' => (int)$c['seats_available']
        ];
    }

    // 整理輸出格式
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
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
