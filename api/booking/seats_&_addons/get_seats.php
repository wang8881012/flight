<?php
session_start();
require_once '../../inc/db.inc.php';

$classType = $_SESSION['class_type'] ?? 'business'; // 用??'business'測試，正式版要改掉

if (!$classType) {
    http_response_code(400);
    echo json_encode(['error' => 'class_type not in session']);
    exit;
}

// 根據 class_type 撈出對應的 flight_classes.id（class_id）
$stmt = $pdo->prepare("SELECT id FROM flight_classes WHERE class_type = ? LIMIT 1");
$stmt->execute([$classType]);
$classId = $stmt->fetchColumn();

if (!$classId) {
    http_response_code(404);
    echo json_encode(['error' => 'class not found']);
    exit;
}

// 查詢已預約的座位
$stmt = $pdo->prepare("SELECT seat_number FROM flight_reserved_seats WHERE class_id = ?");
$stmt->execute([$classId]);
$reservedSeats = $stmt->fetchAll(PDO::FETCH_COLUMN);

// 根據艙等建立座位圖
$layout = [];

if ($classType === 'economy') {
    // 經濟艙：60 座位，10 排 A–F
    $rows = 10;
    $cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    for ($i = 1; $i <= $rows; $i++) {
        $row = [];
        foreach ($cols as $letter) {
            $row[] = $letter . $i;
        }
        $layout[] = $row;
    }
} elseif ($classType === 'business') {
    // 商務艙：J1~J12（3排，每排4個）
    $layout = [
        ['J1', 'J2', 'J3', 'J4'],
        ['J5', 'J6', 'J7', 'J8'],
        ['J9', 'J10', 'J11', 'J12']
    ];
} else {
    http_response_code(400);
    echo json_encode(['error' => 'invalid class_type']);
    exit;
}

// 輸出
header('Content-Type: application/json');
echo json_encode([
    'class_id' => $classId,
    'class_type' => $classType,
    'layout' => $layout,
    'reserved' => $reservedSeats,
    // 旅客人數在這
    'passengerCount' => $_SESSION['passengerCount'] ?? 3  // 預設至少1人 (會員本人)
]);
