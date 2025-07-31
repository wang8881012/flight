<?php
session_start();
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
if (isset($input['redirect'])) {
    $_SESSION['login_redirect'] = $input['redirect'];
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No redirect provided']);
}
