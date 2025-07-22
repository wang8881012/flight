<?php
    $host = 'localhost';        
    $dbName = 'flight';             
    $username = 'root';         
    $password = '';             
    $charset = 'utf8mb4';       

    $dsn = "mysql:host={$host};dbname={$dbName};charset={$charset}";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, 
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,      
        PDO::ATTR_EMULATE_PREPARES   => false,                 
    ];

    try {
        $pdo = new PDO($dsn, $username, $password, $options);
        //echo "資料庫連接成功！<br>";
    } catch (PDOException $e) {
        // 連接失敗時捕獲異常並輸出錯誤訊息
        // 在實際專案中，不應該直接將詳細錯誤訊息顯示給使用者，應記錄到日誌檔，並給予使用者友善提示
        die("資料庫連接失敗: " . $e->getMessage());
    }