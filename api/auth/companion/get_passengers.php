<?php
session_start();
require '../../inc/db.inc.php';
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error" => "尚未登入，請重新登入"
    ]);
    exit();
};

$user_id = $_SESSION["user_id"];

$sql = "select * from saved_passengers where user_id = ? and is_deleted = 0";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $data
]);
exit;