<?php
session_start();
require '../../inc/db.inc.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "缺少 ID"]);
    exit;
}

$sql = "update saved_passengers set is_deleted = 1 where id = ?";
$stmt = $pdo->prepare($sql);
$result = $stmt->execute([$id]);

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "更新失敗"]);
}
