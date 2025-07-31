<?php
session_start();
header('Content-Type: application/json');

// 撈資料並依人數與會員資料渲染表單

// 嚴格檢查用戶會話
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => '未登入或會話已失效']);
    exit;
}

require_once '../inc/db.inc.php';

// 從會話獲取用戶ID
$userId = $_SESSION['user_id'];

// 獲取用戶完整資料 (確保是最新資料)
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ? AND is_deleted = 0");
$stmt->execute([$userId]);
$userData = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$userData) {
    echo json_encode(['error' => '用戶不存在或已被刪除']);
    exit;
}

// 從先前頁面獲取乘客數量 (測試)
$passengerCount = $_SESSION['selectedFlights']['passengerCount'] ?? null;

// 獲取用戶的好友列表
$stmt = $pdo->prepare("SELECT * FROM passenger_info WHERE user_id = ? AND is_deleted = 0");
$stmt->execute([$userId]);
$friends = $stmt->fetchAll(PDO::FETCH_ASSOC);
//die(print_r($friends));
foreach ($friends as &$friend) {
    $friend['passport_name'] = $friend['passport_last_name'] . ', ' . $friend['passport_first_name'];
}

// 返回表單結構和用戶資料
echo json_encode([
    'passenger_count' => $passengerCount,
    'user_data' => $userData,
    'friends' => $friends, // 好友列表
    'form_structure' => [
        'main_passenger' => [
            'title' => '主要乘客 (會員本人)',
            'fields' => [
                'passport_last_name' => ['type' => 'text', 'label' => '英文姓', 'required' => true],
                'passport_first_name' => ['type' => 'text', 'label' => '英文名', 'required' => true],
                'email' => ['type' => 'email', 'label' => 'E-MAIL', 'required' => true],
                'birthday' => ['type' => 'date', 'label' => '出生日期', 'required' => true],
                'phone' => ['type' => 'tel', 'label' => '手機', 'required' => true],
                'gender' => [
                    'type' => 'select', 
                    'label' => '性別', 
                    'options' => ['男' => '男', '女' => '女', '其他' => '其他'],
                    'required' => true
                ],
                'passport_number' => ['type' => 'text', 'label' => '護照號碼', 'required' => true],
                'nationality' => ['type' => 'text', 'label' => '國籍/地區', 'required' => true],
                'passport_expiry' => ['type' => 'date', 'label' => '有效期限', 'required' => true]
            ]
        ],
        'companion_passenger' => [
            'title' => '同行友人',
            'fields' => [
                'use_friend' => ['type' => 'checkbox', 'label' => '選擇已存好友','toggle_target' => 'friend_fields'], // 新增選擇好友選項
                'passport_last_name' => ['type' => 'text', 'label' => '英文姓', 'required' => true],
                'passport_first_name' => ['type' => 'text', 'label' => '英文名', 'required' => true],
                'passport_number' => ['type' => 'text', 'label' => '護照號碼', 'required' => true],
                'nationality' => ['type' => 'text', 'label' => '國籍', 'required' => true],
                'passport_expiry' => ['type' => 'date', 'label' => '護照效期', 'required' => true]
            ]
        ]
    ]
]);
?>