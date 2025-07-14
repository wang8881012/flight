<?php
session_start();
if (!isset($_SESSION['admin'])) {
  http_response_code(401);
  echo json_encode(['error' => '未登入']);
  exit;
}

require_once __DIR__ . '/../inc/db.inc.php';





// 1. 每月訂單數（最近 6 個月）
$sql1 = "
  SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) AS order_count FROM booking WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY month ORDER BY month;
";

$stmt = $pdo->prepare($sql1);
$stmt->execute();
$data1 = [];

while ($row = $stmt->fetch()) {
  $data1[] = [
    'month' => $row['month'],
    'orders' => (int)$row['order_count']
  ];
}

$response['orders'] = $data1;


// 2. 熱門航線排行（長條圖）
$sql2 = "SELECT 
  f.to_airport AS destination,
  COUNT(b.id) AS total_bookings
FROM booking b
JOIN flight_classes fc ON b.class_depart_id = fc.id
JOIN flights f ON fc.flight_id = f.id
WHERE f.direction = 'outbound'
GROUP BY f.to_airport
ORDER BY total_bookings DESC
LIMIT 5;
";
$stmt = $pdo->prepare($sql2);
$stmt->execute();
$data2 = [];

while($row = $stmt->fetch()) {
  $data2[] = [
    'destination' => $row['destination'],
    'total_bookings' => (int)$row['total_bookings']
  ];
}
$response['top_destinations'] = $data2;

//3. 艙等訂票分布(圓餅圖)
$sql3 = "
SELECT 
  fc.class_type as class_type,
  COUNT(b.id) AS total_bookings
FROM booking b
JOIN flight_classes fc ON b.class_depart_id = fc.id
GROUP BY fc.class_type";
$stmt = $pdo->prepare($sql3);
$stmt->execute();
$data3 = [];
while ($row = $stmt->fetch()) {
  $data3[] = [
    'class_type' => $row['class_type'],
    'total_bookings' => (int)$row['total_bookings']
  ];
}
$response['class_distribution'] = $data3;

//營收趨勢圖(折線圖)
$sql4 = "
SELECT 
  DATE_FORMAT(paid_at, '%Y-%m') AS month,
  SUM(amount) AS total_revenue
FROM payments
WHERE status = 'success'
GROUP BY month
ORDER BY month;
";
$stmt = $pdo->prepare($sql4);
$stmt->execute();
$data4 = [];
while ($row = $stmt->fetch()) {
  $data4[] = [
    'month' => $row['month'],
    'revenue' => (float)$row['total_revenue']
  ];
}
$response['sales'] = $data4;


//本週訂單數
$sql5 = "SELECT COUNT(*) AS order_count from booking where created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);";
$stmt = $pdo->prepare($sql5);
$stmt->execute();
$row = $stmt->fetch();
$response['weekly_orders'] = (int)$row['order_count'];

// 本週營收
$sql6 = "SELECT SUM(amount) AS total_revenue FROM payments WHERE status = 'success' AND paid_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);";
$stmt = $pdo->prepare($sql6);
$stmt->execute();
$row = $stmt->fetch();
$response['weekly_revenue'] = (int)$row['total_revenue'];

// 會員數
$sql7 = "SELECT COUNT(*) AS member_count FROM users;";
$stmt = $pdo->prepare($sql7);
$stmt->execute();
$row = $stmt->fetch();
$response['member_count'] = (int)$row['member_count'];

header('Content-Type: application/json');
echo json_encode($response);