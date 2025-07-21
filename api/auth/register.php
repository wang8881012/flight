<?php
session_start();
require "../inc/db.php";

header("Content-Type: application/json");

$account = $_POST["account"];
$password = $_POST["password"];
$username = $_POST["username"];
$gender = $_POST["gender"];
$nationality = $_POST["nationality"];
$phonenum = $_POST["phonenum"];
$birth = $_POST["birth"];
$passportSurname = $_POST["passportSurname"];
$passportGivenname = $_POST["passportGivenname"];
$passportNumber = $_POST["passportNumber"];
$expiryDate = $_POST["expiryDate"];

$stmt = $pdo->prepare("select id from users where email=?");
$stmt->execute([$account]);
if ($stmt->fetch()) {
    echo json_encode(["message" => "此信箱已註冊"]);
    exit();
}

$hashedPwd = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare(
        "insert into users (email, password, name, gender, nationality, phone, birthday, passport_last_name, passport_first_name, passport_expiry, passport_number) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $account, $hashedPwd, $username, $gender, $nationality, $phonenum, $birth, $passportSurname, $passportGivenname, $expiryDate, $passportNumber
    ]);

    echo json_encode(["message" => "註冊成功！"]);

} catch (Exception $e) {
    echo json_encode(["message" => "錯誤：" . $e->getMessage()]);
}
#$_SESSION["user_id"] = $pdo->lastInsertid();