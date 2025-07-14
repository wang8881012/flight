<?php
require_once __DIR__ . '/../inc/db.inc.php';

// 取得 POST 傳來的資料
$data = json_decode(file_get_contents("php://input"), true);

// 分頁參數
$page = isset($data['page']) ? (int)$data['page'] : 1;
$perPage = isset($data['per_page']) ? (int)$data['per_page'] : 10;
$offset = ($page - 1) * $perPage;

// 篩選條件
$where = " WHERE 1 ";
$params = [];

if (!empty($data['user_name'])) {
  $where .= " AND u.name LIKE :user_name ";
  $params[':user_name'] = '%' . $data['user_name'] . '%';
}

if (!empty($data['order_no'])) {
  $where .= " AND b.order_no LIKE :order_no ";
  $params[':order_no'] = '%' . $data['order_no'] . '%';
}
if (!empty($data['status'])) {
  $where .= " AND p.status = :status ";
  $params[':status'] = $data['status'];
}

// 查詢總筆數
$sqlTotal = "
  SELECT COUNT(*) as total
  FROM booking b
  JOIN users u ON b.user_id = u.id
  JOIN flight_classes fc ON b.class_depart_id = fc.id
  JOIN flights f ON fc.flight_id = f.id
  JOIN payments p ON b.id = p.booking_id
  $where
";
$stmt = $pdo->prepare($sqlTotal);
$stmt->execute($params);
$total = $stmt->fetchColumn();

// 查詢實際資料
$sql = "
  SELECT b.id, u.name AS user_name, f.from_airport, f.to_airport,
         f.departure_time, b.total_price, p.status, b.created_at
  FROM booking b
  JOIN users u ON b.user_id = u.id
  JOIN flight_classes fc ON b.class_depart_id = fc.id
  JOIN flights f ON fc.flight_id = f.id
  JOIN payments p ON b.id = p.booking_id
  $where
  ORDER BY b.created_at DESC
  LIMIT :offset, :per_page
";
$stmt = $pdo->prepare($sql);

// 綁定條件參數
foreach ($params as $key => $value) {
  $stmt->bindValue($key, $value);
}
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->bindValue(':per_page', $perPage, PDO::PARAM_INT);

$stmt->execute();
$orders = $stmt->fetchAll();

foreach ($orders as &$order) {
  // 查 passenger_info
  $sqlPassengers = "SELECT name, passport_number, nationality 
                    FROM passenger_info 
                    WHERE booking_id = :bid AND is_deleted = 0";
  $stmt1 = $pdo->prepare($sqlPassengers);
  $stmt1->execute([':bid' => $order['id']]);
  $order['passenger_info'] = $stmt1->fetchAll(PDO::FETCH_ASSOC);

  // 查 booking_addons
  $sqlAddons = "SELECT a.name AS addon_name, ba.segment, ba.quantity, ba.unit_price 
                FROM booking_addons ba
                JOIN addons a ON a.id = ba.addon_id
                WHERE ba.booking_id = :bid";
  $stmt2 = $pdo->prepare($sqlAddons);
  $stmt2->execute([':bid' => $order['id']]);
  $order['booking_addons'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode([
  'data' => $orders,
  'pagination' => [
    'total' => (int)$total,
    'page' => $page,
    'per_page' => $perPage,
    'total_pages' => ceil($total / $perPage)
  ]
]);
