<?php
session_start();
require '../inc/db.inc.php';

// if ($_SERVER["REQUEST_METHOD"] === "POST") {
//     $account = $_POST["account"] ?? '';
//     $password = $_POST["password"] ?? '';

//     $stmt = $pdo->prepare("select * from users where email = ?");
//     $stmt->execute([$account]);
//     $user = $stmt->fetch();


//     if ($user && password_verify($password, $user["password"])) {
//         $_SESSION["user_id"] = $user["id"];
//         $_SESSION["username"] = $user["name"];
//         header("Location: ../../public/profile.html");
//         exit();
//     } else {
//         echo "登入失敗";
//     };
// };

header("Content-Type: application/json");

$account = $_POST["account"] ?? '';
$password = $_POST["password"] ?? '';

$stmt = $pdo->prepare("select * from users where email = ?");
$stmt->execute([$account]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user["password"])) {
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["name"];
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "帳號或密碼錯誤"
    ]);
}
    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["name"];
        // 根據來源頁面決定導向
        $redirect = '../../public/profile.html';
        if (isset($_SESSION['login_redirect']) && $_SESSION['login_redirect']) {
            $redirect = $_SESSION['login_redirect'];
            unset($_SESSION['login_redirect']);
        }
        header("Location: $redirect");
        exit();
    } else {
        echo "登入失敗";
    };
};
