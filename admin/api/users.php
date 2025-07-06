<?php
require_once __DIR__ . '/../inc/db.inc.php';

$data = json_decode(file_get_contents("php://input"), true);

$page = isset($data['page']) ? intval($data['page']) : 1;
$perPage = isset($data['per_page']) ? intval($data['per_page']) : 10;
$offset = ($page - 1) * $perPage;

$where = " WHERE 1 ";
$params = [];

if (!empty($data['keyword'])) {
  $where .= " AND (name LIKE :kw OR email LIKE :kw) ";
  $params[':kw'] = '%' . $data['keyword'] . '%';
}

// 總筆數
$sqlTotal = "SELECT COUNT(*) FROM users $where";
$stmt = $pdo->prepare($sqlTotal);
$stmt->execute($params);
$total = $stmt->fetchColumn();

// 查詢資料
$sql = "
  SELECT id, name, email, phone, birthday, created_at
  FROM users
  $where
  ORDER BY created_at DESC
  LIMIT :offset, :per_page
";
$stmt = $pdo->prepare($sql);
foreach ($params as $key => $val) {
  $stmt->bindValue($key, $val);
}
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->bindValue(':per_page', $perPage, PDO::PARAM_INT);
$stmt->execute();
$users = $stmt->fetchAll();

echo json_encode([
  'data' => $users,
  'pagination' => [
    'total' => (int)$total,
    'page' => $page,
    'per_page' => $perPage,
    'total_pages' => ceil($total / $perPage)
  ]
]);
