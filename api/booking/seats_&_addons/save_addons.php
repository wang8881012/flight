<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

session_start();
require_once '../booking/db.inc.php';

// === 接收 booking_patched.js 傳來的資料 ===
$inputRaw = file_get_contents("php://input");
$data = json_decode($inputRaw, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => '未收到有效 JSON']);
    exit;
}

// === 驗證必要的 session 資料 ===
if (
    !isset($_SESSION['class_type']) ||
    !isset($_SESSION['flight_id']) ||
    !isset($_SESSION['passengerCount']) ||
    !isset($_SESSION['trip_type'])
) {
    echo json_encode(['success' => false, 'message' => '缺少必要 session 資料']);
    exit;
}

// === 資料整理 ===
$classType = $_SESSION['class_type'];
$flightId = $_SESSION['flight_id'];
$passengerCount = (int) $_SESSION['passengerCount'];
$tripType = $_SESSION['trip_type'];
$currentLeg = $_SESSION['current_leg'] ?? 'outbound';

$selectedSeats = $data['selectedSeats'] ?? [];
if (count($selectedSeats) !== $passengerCount) {
    echo json_encode(['success' => false, 'message' => '座位數與人數不符']);
    exit;
}

// === 查艙等資料 ===
$stmt = $pdo->prepare("SELECT id, price FROM flight_classes WHERE flight_id = ? AND class_type = ? LIMIT 1");
$stmt->execute([$flightId, $classType]);
$classRow = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$classRow) {
    echo json_encode(['success' => false, 'message' => '找不到艙等資料']);
    exit;
}

$classId = $classRow['id'];
$classPricePerPerson = $classRow['price'];
$classTotalPrice = $classPricePerPerson * $passengerCount;

// === 處理加購項目 ===
$mealName = $data['meal'] ?? null;
$baggageName = $data['baggage'] ?? null;

$mealPrice = 0;
$baggagePrice = 0;

if ($mealName) {
    $stmt = $pdo->prepare("SELECT price FROM addons WHERE name = ? AND type = 'meal' AND is_deleted = 0 LIMIT 1");
    $stmt->execute([$mealName]);
    $mealPrice = $stmt->fetchColumn() ?: 0;
}

if ($baggageName) {
    $stmt = $pdo->prepare("SELECT price FROM addons WHERE name = ? AND type = 'baggage' AND is_deleted = 0 LIMIT 1");
    $stmt->execute([$baggageName]);
    $baggagePrice = $stmt->fetchColumn() ?: 0;
}

$totalAddonsPrice = $mealPrice + $baggagePrice;
$totalPrice = $classTotalPrice + $totalAddonsPrice;

// === 整理資料物件 ===
$orderData = [
    'flight_id' => $flightId,
    'class_type' => $classType,
    'class_id' => $classId,
    'passenger_count' => $passengerCount,
    'selected_seats' => $selectedSeats,
    'meal' => $mealName,
    'baggage' => $baggageName,
    'meal_price' => $mealPrice,
    'baggage_price' => $baggagePrice,
    'addons_price' => $totalAddonsPrice,
    'class_price_per_person' => $classPricePerPerson,
    'class_total_price' => $classTotalPrice,
    'total_price' => $totalPrice
];

// === 流程判斷 ===
if ($tripType === 'one-way') {
    $_SESSION['order_summary'] = $orderData;
    $nextPage = '../public/confirm_order.php';

} elseif ($tripType === 'round-trip') {
    if ($currentLeg === 'return') {
        // 第二段：回程
        $_SESSION['round_trip_order']['return'] = $orderData;
        unset($_SESSION['current_leg']);
        $nextPage = '../public/confirm_order.php';

    } else {
        // 第一段：去程
        $_SESSION['round_trip_order']['outbound'] = $orderData;

        // 清空去程暫存，準備回程
        unset($_SESSION['flight_id'], $_SESSION['class_type']);

        // 明確標記接下來是回程流程
        $_SESSION['current_leg'] = 'return';

        $nextPage = '../select_return_flight.php';
    }

} else {
    echo json_encode(['success' => false, 'message' => '未知行程類型']);
    exit;
}

// === 回傳成功與下一步頁面 ===
echo json_encode(['success' => true, 'next' => $nextPage]);
exit;
