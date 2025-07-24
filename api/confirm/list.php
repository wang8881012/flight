<?php
//撈取資料並echo出去，模擬訂購資訊

header('Content-Type: application/json');
require '../inc/db.inc.php';

// 確認有帶 booking_id
if (!isset($_GET['booking_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing booking_id']);
    exit;
}

$booking_id = $_GET['booking_id'];

try {
    // 撈出訂單所有旅客、航班與座位資訊
    $stmt = $pdo->prepare("
        SELECT 
            pi.full_name AS passenger,
            f.from_airport,
            f.to_airport,
            f.departure_time,
            f.arrival_time,
            f.flight_no,
            frs.seat_number
        FROM booking b
        JOIN passenger_info pi ON b.id = pi.booking_id
        JOIN flight_reserved_seats frs ON frs.booking_id = b.id AND frs.passenger_id = pi.id
        JOIN flights f ON f.id IN (b.class_depart_id, b.class_return_id)
        WHERE b.id = ?
    ");
    $stmt->execute([$booking_id]);
    $booking_details = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $booking_details
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
