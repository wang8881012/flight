<?php
session_start();
require __DIR__ . '/../../vendor/autoload.php';

use Ecpay\Sdk\Factories\Factory;

$factory = new Factory([
    'hashKey' => 'pwFHCqoQZGmho4w6',
    'hashIv'  => 'EkRm7iFT261dpevs',
]);
$service = $factory->create('AutoSubmitFormWithCmvService');

$oid = 'NNNN' . time();

$input = [
    'MerchantID'        => '3002607',                   // 商店代號
    'MerchantTradeNo'   => $oid,                        // 訂單編號
    'MerchantTradeDate' => date('Y/m/d H:i:s'),         // 訂單時間
    'PaymentType'       => 'aio',                       // 交易類型 (固定值，表示使用「全方位金流」介面)
    'TotalAmount'       => 100,                         // 金額
    'TradeDesc'         => '測試交易',                   // 交易描述
    'ItemName'          => '測試商品',                   // 商品名稱
    'ChoosePayment'     => 'Credit',                    // 付款方式
    'EncryptType'       => 1,                           // 加密類型

    'ReturnURL'         => 'http://rnyex-150-117-19-191.a.free.pinggy.link/flight/api/confirm/ecpay_return.php',
    'OrderResultURL'    => 'https://rnyex-150-117-19-191.a.free.pinggy.link/flight/api/confirm/ecpay_return.php'
];
$action = 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5';

echo $service->generate($input, $action);