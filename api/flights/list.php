<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../inc/db.inc.php';

try {
    $stmt = $pdo->query("SELECT DISTINCT from_airport_name, to_airport_name FROM flights");
    $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'flights' => $flights
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
