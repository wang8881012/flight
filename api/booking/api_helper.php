<?php
// api_helper.php

function send_json($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function get_json_input() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return $data ?? [];
}

function db_connect() {
    $conn = new mysqli('localhost', 'root', '', 'flight');
    if ($conn->connect_error) {
        send_json(['error' => '資料庫連線失敗'], 500);
    }
    return $conn;
}
