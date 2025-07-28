<?php
session_start();
require "../inc/db.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error" => "尚未登入，請重新登入"
    ]);
    exit();
};

$user_id = $_SESSION["user_id"];

$sql = "
    SELECT * FROM (
        select
            p.amount as 總計,
            a.name as 加購項目,
            '去程' as 航段類型,
            f.flight_no as 航班編號,
            f.duration as 飛行時間,
            f.from_airport as 出發地機場代碼,
            f.from_airport_name as 出發地機場名稱,
            f.to_airport as 目的地機場代碼,
            f.to_airport_name as 目的地機場名稱,
            f.departure_time as 出發時間,
            f.arrival_time as 抵達時間,
            fc.class_type as 艙等

        from payments p
        join booking b on p.booking_id = b.id
        join flight_classes fc on b.class_depart_id = fc.id
        join flights f on fc.flight_id = f.id
        left join booking_addons ba on ba.booking_id = b.id
        left join addons a on a.id = ba.addon_id

        where b.user_id = ? 
        and f.departure_time > NOW() 
        and f.arrival_time > NOW()


        union all

        select
            p.amount as 總計,
            a.name as 加購項目,
            '回程' as 航段類型,
            f.flight_no as 航班編號,
            f.duration as 飛行時間,
            f.from_airport as 出發地機場代碼,
            f.from_airport_name as 出發地機場名稱,
            f.to_airport as 目的地機場代碼,
            f.to_airport_name as 目的地機場名稱,
            f.departure_time as 出發時間,
            f.arrival_time as 抵達時間,
            fc.class_type as 艙等

        from payments p
        join booking b on p.booking_id = b.id
        join flight_classes fc on b.class_return_id = fc.id
        join flights f on fc.flight_id = f.id
        left join booking_addons ba on ba.booking_id = b.id
        left join addons a on a.id = ba.addon_id

        where b.user_id = ?
        and f.departure_time > NOW() 
        and f.arrival_time > NOW()
    ) AS all_orders
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id, $user_id]);
$data = $stmt->fetchAll();

echo json_encode(["success" => true, "data" => $data]);