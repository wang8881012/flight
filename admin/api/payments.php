<?php
require_once __DIR__ . '/../inc/db.inc.php';

$data = json_decode(file_get_contents("php://input"), true);

// 分頁參數
$page = isset($data['page']) ? intval($data['page']) : 1;
$perPage = isset($data['per_page']) ? intval($data['per_page']) : 10;
$offset = ($page - 1) * $perPage;

// 篩選條件
$where = " WHERE 1 ";
$params = [];

if (!empty($data['keyword'])) {
  $where .= " AND u.name LIKE :kw ";
  $params[':kw'] = '%' . $data['keyword'] . '%';
}

if (!empty($data['status'])) {
  $where .= " AND p.status = :status ";
  $params[':status'] = $data['status'];
}

if (!empty($data['start_date'])) {
  $where .= " AND p.paid_at >= :start";
  $params[':start'] = $data['start_date'] . ' 00:00:00';
  
}

if (!empty($data['end_date'])) {
  $where .= " AND p.paid_at <= :end ";
  $params[':end'] = $data['end_date'] . ' 23:59:59';
}



// 查詢總筆數
$sqlTotal = "
  SELECT COUNT(*) as total
  FROM payments p
  JOIN booking b ON p.booking_id = b.id
  JOIN users u ON b.user_id = u.id
  $where
";
$stmt = $pdo->prepare($sqlTotal);
$stmt->execute($params);
$total = $stmt->fetch()['total'];

// 查詢資料
$sql = "
  SELECT p.id, u.name AS user_name, p.amount, p.paid_at, p.method, p.transaction_id, p.status
  FROM payments p
  JOIN booking b ON p.booking_id = b.id
  JOIN users u ON b.user_id = u.id
  $where
  ORDER BY p.paid_at DESC
  LIMIT :offset, :per_page
";
$stmt = $pdo->prepare($sql);
foreach ($params as $key => $val) {
  $stmt->bindValue($key, $val);
}
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->bindValue(':per_page', $perPage, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

echo json_encode([
  'data' => $rows,
  'pagination' => [
    'total' => (int)$total,
    'page' => $page,
    'per_page' => $perPage,
    'total_pages' => ceil($total / $perPage)
  ]
]);
