<?php
session_start();
header('Content-Type: application/json');

// 接收前端post旅客資料，寫入資料庫

require_once '../inc/db.inc.php'; // 假設這裡包含PDO連接

// 驗證會話和用戶登入狀態
// if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id'])) {
//     echo json_encode(['success' => false, 'message' => '未登入或會話已過期']);
//     exit;
// }

$userId = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['passengers'])) {
    echo json_encode(['success' => false, 'message' => '無效的輸入數據']);
    exit;
}

// die(var_dump($userId));
$member = $input['member'];
$passengers = $input['passengers'];
//die(print_r($member));
$response = ['success' => true, 'message' => ''];

$_SESSION['passenger_info'] = [
    'main_user' => $member, 
    'passenger' => $passengers
];
//die(print_r(($_SESSION['passenger_info'])));

try {
    $pdo->beginTransaction();
    
    // 處理主要乘客 (更新users表)
    if (count($passengers) > 0) {
        $mainPassenger = $member;
        
        $updateSql = "UPDATE users SET 
            passport_first_name = :passport_first_name,
            passport_last_name = :passport_last_name,
            email = :email,
            birthday = :birthday,
            phone = :phone,
            gender = :gender,
            passport_number = :passport_number,
            nationality = :nationality,
            passport_expiry = :passport_expiry
            WHERE id = :id";
            
        $stmt = $pdo->prepare($updateSql);
        $stmt->execute([
            ':passport_first_name' => $mainPassenger['passport_first_name'],
            ':passport_last_name' => $mainPassenger['passport_last_name'],
            ':email' => $mainPassenger['email'],
            ':birthday' => $mainPassenger['birthday'],
            ':phone' => $mainPassenger['phone'],
            ':gender' => $mainPassenger['gender'],
            ':passport_number' => $mainPassenger['passport_number'],
            ':nationality' => $mainPassenger['nationality'],
            ':passport_expiry' => $mainPassenger['passport_expiry'],
            ':id' => $userId
        ]);
    }
    
    // 處理同行友人 (插入passenger_info表)
    for ($i = 1; $i < count($passengers); $i++) {
        $companion = $passengers[$i];
        
         // 驗證必要欄位
        $requiredFields = [
            'passport_first_name', 
            'passport_last_name',
            'passport_number',
            'nationality',
            'passport_expiry'
        ];
        
        foreach ($requiredFields as $field) {
            if (empty($companion[$field])) {
                $pdo->rollBack();
                echo json_encode([
                    'success' => false,
                    'message' => "同行友人 {$i} 缺少必要欄位: {$field}"
                ]);
                exit;
            }
        }

        $insertSql = "INSERT INTO passenger_info (
            user_id, 
            passport_first_name, 
            passport_last_name, 
            passport_number, 
            nationality, 
            passport_expiry,
            passport_name,
            name,
            gender,
            birthday
        ) VALUES (
            :user_id, 
            :passport_first_name, 
            :passport_last_name, 
            :passport_number, 
            :nationality, 
            :passport_expiry,
            :passport_name,
            :name,
            :gender,
            :birthday
        )";
        
        // 組合護照全名 (英文姓 + 英文名)
        $passportName = $companion['passport_last_name'] . ', ' . $companion['passport_first_name'];
        $name = $companion['passport_first_name'] . ' ' . $companion['passport_last_name'];
        
        $stmt = $pdo->prepare($insertSql);
        $stmt->execute([
            ':user_id' => $userId,
            ':passport_first_name' => $companion['passport_first_name'],
            ':passport_last_name' => $companion['passport_last_name'],
            ':passport_number' => $companion['passport_number'],
            ':nationality' => $companion['nationality'],
            ':passport_expiry' => $companion['passport_expiry'],
            ':passport_name' => $passportName,
            ':name' => $name,
            ':gender' => isset($companion['gender']) ? $companion['gender'] : '未知',
            ':birthday' => isset($companion['birthday']) ? $companion['birthday'] : null
        ]);
    }
    


    $pdo->commit();
    echo json_encode([$_SESSION['passenger_info'], 'success' => true, 'message' => '乘客資料已成功儲存']);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '資料庫錯誤: ' . $e->getMessage()]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '發生錯誤: ' . $e->getMessage()]);
}


//echo json_encode($_SESSION['passenger_info']);
?>