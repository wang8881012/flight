<?php
header('Content-Type: application/json');

// 模擬資料（與你提供的圖一樣）
$response = [
    "passengerCount" => 2,
    "tripType" => "round",
    "totalPrice" => 36220,
    "outbound" => [
        "id" => 109,
        "flight_no" => "AIR2108",
        "class_type" => "economy",
        "price" => 8923,
        "from_airport_name" => "臺灣桃園國際機場",
        "departure_time" => "2025-08-02 08:00:00",
        "arrival_time" => "2025-08-02 12:30:00"
    ],
    "inbound" => [
        "id" => 109,
        "flight_no" => "AIR2108",
        "class_type" => "economy",
        "price" => 8923,
        "from_airport_name" => "臺灣桃園國際機場",
        "departure_time" => "2025-08-02 08:00:00",
        "arrival_time" => "2025-08-02 12:30:00"
    ]
];

// 回傳 JSON 給前端
echo json_encode($response);
