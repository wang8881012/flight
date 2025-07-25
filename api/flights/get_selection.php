<?php
session_start();

if (isset($_SESSION['selectedFlights'])) {
    echo json_encode([
        'status' => 'success',
        'data' => $_SESSION['selectedFlights']
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => '找不到已選航班資訊'
    ]);
}
