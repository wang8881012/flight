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
        $class_type = $data['class_type'] ?? '';
        $routes = $data['routes'] ?? '';
        

        $where = ['is_deleted = 0'];
        $params = [];

        if ($flight_no !== '') {
            $where[] = 'flight_no LIKE :flight_no';
            $params[':flight_no'] = '%' . $flight_no . '%';
            }

        if ($class_type !== '') {
            $where[] = 'class_type = :class_type';
            $params[':class_type'] = $class_type;
        }

        if ($routes !== '') {
        $where[] = 'routes = :routes';
        $params[':routes'] = $routes;
        }

        
        // 查詢實際資料
        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $sql = "select c.id, f.flight_no, f.routes,c.class_type, c.price, c.seats_available from flight_classes c JOIN flights f ON f.id = c.flight_id $whereSql ORDER BY c.id LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll();

        // 總筆數
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM flight_classes c JOIN flights f ON f.id = c.flight_id $whereSql");
        foreach ($params as $key => $value) {
        $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

        echo json_encode([
        'data' => $data,
        'pagination' => [
            'total' => (int)$total,
            'page' => $page,
            'per_page' => $perPage,
            'total_pages' => ceil($total / $perPage)
        ]
        ]);
        break;

        case 'create':
            $sql = "INSERT INTO flight_classes (class_type, price, seats_available) 
                    VALUES (:class_type, :price, :seats_available)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                
                ':class_type' => $data['class_type'] ?? '',
                ':price' => $data['price'] ?? 0,
                ':seats_available' => $data['seats_available'] ?? 0
            ]);
            echo json_encode(['status' => 'success']);
            break;

        case 'update':
            $sql = "UPDATE flight_classes SET class_type = :class_type, price = :price, seats_available = :seats_available 
                    WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $data['id'] ?? 0,
                ':class_type' => $data['class_type'] ?? '',
                ':price' => $data['price'] ?? 0,
                ':seats_available' => $data['seats_available'] ?? 0
            ]);

            echo json_encode(['success' => true]);
            break;
        
        case 'delete':
            $sql = "UPDATE flight_classes SET is_deleted = 1 WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $data['id'] ?? 0]);
            echo json_encode(['success' => true]);
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
            break;

}
