<?php
session_start();
require "../inc/db.inc.php";
header('Content-Type: application/json');

if (!isset($_SESSION["user_id"])) {
    header("Location: ../../public/login.html");
    exit();
};

$user_id = $_SESSION["user_id"];

if ($_SERVER["REQUEST_METHOD"] === 'GET') {
    $stmt = $pdo->prepare(
        "select user_number, name, nationality, phone, gender, birthday, passport_last_name, passport_first_name, passport_number, passport_expiry from users where id = ?"
    );
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($user);
} elseif ($_SERVER["REQUEST_METHOD"] === 'POST') {
    $name = $_POST["name"] ?? '';
    $nationality = $_POST["nationality"] ?? '';
    $phonenum = $_POST["phonenum"] ?? '';
    $gender = $_POST["gender"] ?? '';
    $birth = $_POST["birth"] ?? '';
    $passportSurname = $_POST["passportSurname"] ?? '';
    $passportGivenname = $_POST["passportGivenname"] ?? '';
    $passportNumber = $_POST["passportNumber"] ?? '';
    $expiryDate = $_POST["expiryDate"] ?? '';

    $stmt = $pdo->prepare("update users set name=?, nationality=?, phone=?, gender=?, birthday=?, passport_last_name=?, passport_first_name=?, passport_number=?, passport_expiry=? where id=?");
    $stmt->execute([$name, $nationality, $phonenum, $gender, $birth, $passportSurname, $passportGivenname, $passportNumber, $expiryDate, $user_id]);

    echo json_encode(["message" => "資料已更新！"]);
}