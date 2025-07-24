<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
session_start();
require_once __DIR__ . '../../../api/inc/db.inc.php';

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    //  JSON 
    $input = json_decode(file_get_contents("php://input"), true);
    $acc = isset($input["acc"]) ? $input["acc"] : '';
    $pwd = isset($input["pwd"]) ? $input["pwd"] : '';

    if ($acc === '' || $pwd === '') {
        echo json_encode(['success' => false, 'message' => '請輸入帳號密碼']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT acc, pwd FROM admin WHERE acc = :acc AND pwd = md5(:pwd)");
    $stmt->execute([
        ":acc" => $acc,
        ":pwd" => $pwd
    ]);

$admin = $stmt->fetch();

if ($admin) {
  $_SESSION['admin'] = [
   
    'acc' => $admin['acc'],
  ];
  echo json_encode(['success' => true]);
} else {
  http_response_code(401);
  echo json_encode(['success' => false, 'error' => '帳號或密碼錯誤']);
}
}
?>