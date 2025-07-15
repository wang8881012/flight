<?php
$host = 'localhost';       // 資料庫主機位置
$dbname = 'flight';        // 資料庫名稱
$user = 'root';            // 資料庫使用者
$pass = '';                // 資料庫密碼（空的話留空字串）

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo '資料庫連線成功';
} catch (PDOException $e) {
    echo '連線失敗：' . $e->getMessage();
    exit;
}
?>
