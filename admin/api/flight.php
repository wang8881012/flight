<?php
session_start();
require_once __DIR__ . '/../inc/db.inc.php';
$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? [];

switch ($action) {
  case 'list':
    $page = intval($data['page'] ?? 1);
$perPage = intval($data['perPage'] ?? 10);
$offset = ($page - 1) * $perPage;
$flight_no = $data['flight_no'] ?? '';
$from = $data['from'] ?? '';
$to = $data['to'] ?? '';

$where = [];
$params = [];

if ($flight_no !== '') {
  $where[] = 'flight_no LIKE :flight_no';
  $params[':flight_no'] = '%' . $flight_no . '%';
}
if ($from !== '') {
  $where[] = 'from_airport = :from';
  $params[':from'] = $from;
}
if ($to !== '') {
  $where[] = 'to_airport = :to';
  $params[':to'] = $to;
}
$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$sql = "SELECT * FROM flights $whereSql ORDER BY departure_time LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($sql);
foreach ($params as $key => $value) {
  $stmt->bindValue($key, $value);
}
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$data = $stmt->fetchAll();

// 總筆數
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM flights $whereSql");
foreach ($params as $key => $value) {
  $countStmt->bindValue($key, $value);
}
$countStmt->execute();
$total = $countStmt->fetchColumn();

echo json_encode([
  'data' => $data,
  'page' => $page,
  'perPage' => $perPage,
  'total' => $total
]);
break;

  case 'create':
    $sql = "INSERT INTO flights (flight_no, from_airport, to_airport, departure_time, arrival_time, direction) 
                    VALUES (:flight_no, :from_airport, :to_airport, :departure_time, :arrival_time, :direction)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':flight_no' => $data['flight_no'] ?? '',
        ':from_airport' => $data['from_airport'] ?? '',
        ':to_airport' => $data['to_airport'] ?? '',
        ':departure_time' => $data['departure_time'] ?? null,
        ':arrival_time' => $data['arrival_time'] ?? null,
        ':direction' => $data['direction'] ?? 'outbound',
      ]);
      echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
      break;

   case 'update':
            if (empty($data['id'])) throw new Exception("ID 缺少");
            $sql = "UPDATE flights SET flight_no = :flight_no, from_airport = :from_airport, to_airport = :to_airport, 
                    departure_time = :departure_time, arrival_time = :arrival_time, direction = :direction WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':flight_no' => $data['flight_no'] ?? '',
                ':from_airport' => $data['from_airport'] ?? '',
                ':to_airport' => $data['to_airport'] ?? '',
                ':departure_time' => $data['departure_time'] ?? null,
                ':arrival_time' => $data['arrival_time'] ?? null,
                ':direction' => $data['direction'] ?? 'outbound',
                ':id' => $data['id'],
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'delete':
            if (empty($data['id'])) throw new Exception("ID 缺少");
            $sql = "DELETE FROM flights WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $data['id']]);
            echo json_encode(['success' => true]);
            break;

        default:
            throw new Exception("未知操作: $action");
    }


 
