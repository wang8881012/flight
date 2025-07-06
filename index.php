<?php
session_start();
$_SESSION['cart'] = [
    'items' => [
        '1' => 2  // 假設商品 ID=1，數量=2
    ]
];
?>
<!DOCTYPE html>
<html>
<body>
    <form action="ecpay.php" method="POST">
        <button type="submit">前往綠界付款</button>
    </form>
</body>
</html>