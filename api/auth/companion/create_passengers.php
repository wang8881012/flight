<?php
session_start();
require '../../inc/db.php';
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error" => "尚未登入，請重新登入"
    ]);
    exit();
};

$user_id = $_SESSION["user_id"];

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $stmt = $pdo->prepare("select * from saved_passengers where user_id = ?");
    $stmt->execute([$user_id]);
    $data = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
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

    $id = $pdo->lastInsertId();
    $sql2 = "select * from saved_passengers where id = ?";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([$id]);
    $data = $stmt2->fetch();

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}