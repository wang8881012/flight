<?php
session_start();
header('Content-Type: application/json');

// 引入資料庫連線（請依專案實際位置修改）
require_once '../inc/db.inc.php';

// 檢查 session 中是否有選擇的航班
if (!isset($_SESSION['selectedFlights'])) {
    echo json_encode(['error' => '找不到航班資訊']);
    exit;
}

$flightData = json_decode($_SESSION['selectedFlights'], true);
$tripType = $flightData['tripType'] ?? 'oneway'; // 預設單程
$response = [];

try {
    if ($tripType === 'round') {
        // 來回行程
        $outboundId = $flightData['outbound']['id'] ?? null;
        $returnId = $flightData['id'] ?? null;

        if (!$outboundId || !$returnId) {
            echo json_encode(['error' => '找不到去程或回程 ID']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM flights WHERE id IN (?, ?) AND is_deleted = 0");
        $stmt->execute([$outboundId, $returnId]);
        $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response['success'] = true;
        $response['tripType'] = 'round';
        foreach ($flights as $f) {
            if ($f['id'] == $outboundId) {
                $response['outbound'] = $f;
            } elseif ($f['id'] == $returnId) {
                $response['return'] = $f;
            }
        }
    } elseif ($tripType === 'oneway') {
        // 單程行程
        $onewayId = $flightData['oneway']['id'] ?? null;
        if (!$onewayId) {
            echo json_encode(['error' => '找不到單程 ID']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM flights WHERE id = ? AND is_deleted = 0");
        $stmt->execute([$onewayId]);
        $onewayFlight = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($onewayFlight) {
            $response = [
                'success' => true,
                'tripType' => 'oneway',
                'oneway' => $onewayFlight
            ];
        } else {
            echo json_encode(['error' => '找不到單程航班資料']);
            exit;
        }
    } else {
        echo json_encode(['error' => 'tripType 無效']);
        exit;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(['error' => '資料庫錯誤：' . $e->getMessage()]);
}
