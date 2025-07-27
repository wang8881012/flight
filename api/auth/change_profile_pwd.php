<?php
session_start();
require "../inc/db.php";
header('Content-Type: application/json');

if (!isset($_SESSION["user_id"])) {
    header("Location: ../../public/login.html");
    exit();
};

$user_id = $_SESSION["user_id"];

$old = $_POST["oldPassword"] ?? "";
$new = $_POST["newPassword"] ?? "";
$confirm = $_POST["confirmPassword"] ?? "";

// 檢查欄位是否為空
if (empty($old) || empty($new)) {
    echo json_encode(["success" => false, "message" => "請填寫所有欄位"]);
    exit;
}

if ($new !== $confirm) {
    echo json_encode(["success" => false, "message" => "新密碼與確認密碼不一致"]);
    exit;
}

$stmt = $pdo->prepare("select password from users where id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(["success" => false, "message" => "使用者不存在"]);
    exit;
}

// 驗證舊密碼
if (!password_verify($old, $user["password"])) {
    echo json_encode(["success" => false, "message" => "原密碼錯誤"]);
    exit;
}

// 新密碼更新
$new_hashed = password_hash($new, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("update users set password = ? where id = ?");
$stmt->execute([$new_hashed, $user_id]);

echo json_encode(["success" => true, "message" => "密碼修改成功"]);