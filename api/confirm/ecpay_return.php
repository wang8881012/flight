<?php
//測試付款完成return用的
file_put_contents('log.txt', print_r($_POST, true)); // 簡單記錄結果
echo '付款完成！';