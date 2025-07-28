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

$id = $_POST["id"] ?? '';
$name = $_POST["n_name"] ?? '';
$lastname = $_POST["n_lastname"] ?? '';
$firstname = $_POST["n_firstname"] ?? '';
$gender = $_POST["n_gender"] ?? '';
$birth = $_POST["n_birth"] ?? '';
$number = $_POST["n_number"] ?? '';
$nationality = $_POST["n_nationality"] ?? '';
$expiry = $_POST["n_expiry"] ?? '';

if (!$name || !$lastname || !$firstname || !$gender || !$birth || !$number || !$nationality || !$expiry) {
    echo json_encode(["success" => false, "message" => "資料不完整"]);
    exit;
}

$sql = "update saved_passengers 
        set name = ?, passport_last_name = ?, passport_first_name = ?, gender = ?, birthday = ?, passport_number = ?, nationality = ?, passport_expiry = ? 
        where id = ? and user_id = ?";
$stmt = $pdo->prepare($sql);
$success = $stmt->execute([$name, $lastname, $firstname, $gender, $birth, $number, $nationality, $expiry, $id, $_SESSION["user_id"]]);

if ($success) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "更新失敗"]);
}