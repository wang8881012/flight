<?php
require_once __DIR__ . '/../inc/db.inc.php';

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? [];

switch ($action) {
  case 'list':
$page = isset($data['page']) ? intval($data['page']) : 1;
$perPage = isset($data['per_page']) ? intval($data['per_page']) : 10;
$offset = ($page - 1) * $perPage;

$where = " WHERE 1 ";
$params = [];

// die(var_dump($data['keyword']));
if (!empty($data['name'])) {
  $where .= " AND name LIKE :name ";
  $params[':name'] = '%' . $data['name'] . '%';
}

if (!empty($data['email'])) {
  $where .= " AND email LIKE :email ";
  $params[':email'] = '%' . $data['email'] . '%';
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
  $where and is_deleted = 0
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

break;

case 'create':
  $sql = "INSERT INTO users (name, email, phone, birthday) 
          VALUES (:name, :email, :phone, :birthday)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':name' => $data['name'] ?? '',
    ':email' => $data['email'] ?? '',
    ':phone' => $data['phone'] ?? '',
    ':birthday' => $data['birthday'] ?? ''
  ]);
  echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
  break;

case 'update':
  $sql = "UPDATE users SET
          name = :name, 
          email = :email, 
          phone = :phone, 
          birthday = :birthday 
          WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':id' => $data['id'],
    ':name' => $data['name'] ?? '',
    ':email' => $data['email'] ?? '',
    ':phone' => $data['phone'] ?? '',
    ':birthday' => $data['birthday'] ?? ''
  ]);
   echo json_encode(['success' => true]);
  break;

case 'delete':
  $sql = "UPDATE users SET is_deleted = 1 WHERE id = :id;";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':id' => $data['id']]);
  echo json_encode(['success' => true]);
  break;
}