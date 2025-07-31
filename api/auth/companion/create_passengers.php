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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"] ?? '';
    $lastname = $_POST["lastname"] ?? '';
    $firstname = $_POST["firstname"] ?? '';
    $gender = $_POST["gender"] ?? '';
    $birth = $_POST["birth"] ?? '';
    $number = $_POST["number"] ?? '';
    $nationality = $_POST["nationality"] ?? '';
    $expirydate = $_POST["expirydate"] ?? '';

    if (!$name || !$lastname || !$firstname || !$gender || !$birth || !$number || !$nationality || !$expirydate) {
        echo json_encode([
            "success" => false, 
            "message" => "缺少欄位"
        ]);
        exit;
    }
    // 新增資料
    $sql = "insert into saved_passengers (user_id, name, passport_last_name, passport_first_name, gender, birthday, passport_number, nationality, passport_expiry)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id, $name, $lastname, $firstname, $gender, $birth, $number, $nationality, $expirydate]);

    echo json_encode([
        "success" => true,
    ]);
    exit;
}