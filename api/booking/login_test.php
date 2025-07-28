<?php
session_start();
require_once '../inc/db.inc.php';

// 紀錄 session 用的測試檔案

// 測試用預設值
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// 驗證用戶
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND is_deleted = 0");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

//die(print_r($user));

//這邊的 if 先撇除密碼驗證 (&& password_verify($password, $user['password']))
if ($user) { 
    // 確保會話完全初始化
    session_regenerate_id(true);
    
    $_SESSION['user'] = [
        'id' => $user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'gender' => $user['gender'],
        'phone' => $user['phone'],
        'passport_name' => $user['passport_name'],
        'passport_first_name' => $user['passport_first_name'],
        'passport_last_name' => $user['passport_last_name'],
        'passport_number' => $user['passport_number'],
        'passport_expiry' => $user['passport_expiry'],
        'nationality' => $user['nationality'],
        'birthday' => $user['birthday']
    ];

    // 調試用 - 僅在測試環境顯示
    // if ($_SERVER['HTTP_HOST'] === 'localhost') {
    //     echo '<pre>Session data: ';
    //     print_r($_SESSION);
    //     echo '</pre>';
        
    //     // 提供直接前往表單頁面的連結
    //     echo '<a href="../../public/passenger_form.html">前往乘客表單</a>';
    //     exit;
    // }
    
    header('Location: ../../public/booking01.html');
    exit;
} else {
    header('Location: login.html?error=1');
    exit;
}
?>