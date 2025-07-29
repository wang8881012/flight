<?php
// 撈出加購項目資料
require_once '../../inc/db.inc.php';
header('Content-Type: application/json');

// 撈出未被刪除的所有加購項目
$stmt = $pdo->query("SELECT id, name, type, price FROM addons WHERE is_deleted = 0");
$addons = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($addons);
