<?php
session_start(); 
require_once '../inc/db.inc.php';

// 撈出已預訂座位資訊

$flightId = $_SESSION['id'] ?? 3; // 假設要查詢 flight.id = 3 的航班

$sql = "
SELECT 
    frs.seat_number,
    frs.booking_id,
    frs.passenger_id,
    fc.class_type,
    fc.flight_id,
    f.flight_no
FROM flight_reserved_seats AS frs
JOIN flight_classes AS fc ON frs.class_id = fc.id
JOIN flights AS f ON fc.flight_id = f.id
WHERE f.id = :flight_id
";

$stmt = $pdo->prepare($sql);
$stmt->execute(['flight_id' => $flightId]);
$reservedSeats = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 將資料存入 session
$_SESSION['reserved_seats'] = $reservedSeats;

// 回傳 JSON 格式
header('Content-Type: application/json');
echo json_encode($reservedSeats);
