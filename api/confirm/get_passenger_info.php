<?php
session_start();
// 由renderPassengers.js接收
echo json_encode($_SESSION['passenger_info']);