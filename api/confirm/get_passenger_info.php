<?php
session_start();
// 由renderPassengers.js接收
header('Content-Type: application/json');
echo json_encode($_SESSION['passenger_info']);