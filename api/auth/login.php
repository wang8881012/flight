<?php
session_start();
require '../inc/db.inc.php';

header("Content-Type: application/json");

$account = $_POST["account"] ?? '';
$password = $_POST["password"] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$account]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user["password"])) {
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["name"];

    // 成功登入後看是否有 redirect
    $redirect_url = $_SESSION['login_redirect'] ?? '../public/profile.html';
    unset($_SESSION['login_redirect']); // 清除用過的 redirect

    echo json_encode([
        "success" => true,
        "redirect_url" => $redirect_url
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "帳號或密碼錯誤"
    ]);
}
