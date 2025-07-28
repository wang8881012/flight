<?php
session_start();
require "../inc/db.inc.php";

header("Content-Type: application/json");

// $account = $_POST["account"];
// $password = $_POST["password"];
// $username = $_POST["username"];
// $gender = $_POST["gender"];
// $nationality = $_POST["nationality"];
// $phonenum = $_POST["phonenum"];
// $birth = $_POST["birth"];
// $passportSurname = $_POST["passportSurname"];
// $passportGivenname = $_POST["passportGivenname"];
// $passportNumber = $_POST["passportNumber"];
// $expiryDate = $_POST["expiryDate"];

$input = json_decode(file_get_contents("php://input"), true);

$account = $input["account"];
$password = $input["password"];
$username = $input["username"];
$gender = $input["gender"];
$nationality = $input["nationality"];
$phonenum = $input["phonenum"];
$birth = $input["birth"];
$passportSurname = $input["passportSurname"];
$passportGivenname = $input["passportGivenname"];
$passportNumber = $input["passportNumber"];
$expiryDate = $input["expiryDate"];

$stmt = $pdo->prepare("select id from users where email=?");
$stmt->execute([$account]);
if ($stmt->fetch()) {
    echo json_encode(["message" => "此信箱已註冊"]);
    exit();
}

// add user number randomly
function generateUserNum($length = 6) {
    $numbers = "0123456789";
    $card = "";
    for ($i = 0; $i < $length; $i ++) {
        $card .= $numbers[rand(0, strlen($numbers) - 1)];
    }
    return $card;
}

function getUniUserNum($pdo) {
    do {
        $userNum = generateUserNum();
        $stmt = $pdo->prepare("select count(*) from users where user_number = ?");
        $stmt->execute([$userNum]);
        $count = $stmt->fetchColumn();
    } while ($count > 0);
    return $userNum;
}

$hashedPwd = password_hash($password, PASSWORD_DEFAULT);
$userNum = getUniUserNum($pdo);

try {
    $stmt = $pdo->prepare(
        "insert into users (user_number, email, password, name, gender, nationality, phone, birthday, passport_last_name, passport_first_name, passport_expiry, passport_number) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $userNum, $account, $hashedPwd, $username, $gender, $nationality, $phonenum, $birth, $passportSurname, $passportGivenname, $expiryDate, $passportNumber
    ]);

    // 撈剛剛新增的使用者資料
    $stmt = $pdo->prepare("select id, name from users where email = ?");
    $stmt->execute([$account]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["name"];
    }

    echo json_encode([
        "success" => true,
        "message" => "註冊成功！",
    ]);

} catch (Exception $e) {
    echo json_encode(["message" => "錯誤：" . $e->getMessage()]);
}