document.addEventListener('DOMContentLoaded', function () {
    // 從 session 獲取資料 (實際開發中需通過 AJAX 從後端獲取)
    fetch('../api/confirm/get_payment_info.php')
        .then(res => res.json())
        .then(data => {
            const paymentInfo = data.payment_info || {};
            const bookingInfo = data.booking_info || {};

            // 更新頁面資訊
            if (paymentInfo.status === 'success') {
                document.getElementById('booking-number').textContent = `訂單編號：${paymentInfo.order_id}`;

                // 更新去程資訊
                const departTbody = document.getElementById('depart');
                departTbody.innerHTML = `
                    <tr>
                        <th>${bookingInfo.departure.passenger}</th>
                        <td>${bookingInfo.departure.route}</td>
                        <td>${bookingInfo.departure.time}</td>
                        <td>${bookingInfo.departure.flight_no}</td>
                        <td>${bookingInfo.departure.seat}</td>
                    </tr>
                `;

                // 更新回程資訊
                const returnTbody = document.getElementById('return');
                returnTbody.innerHTML = `
                    <tr>
                        <th>${bookingInfo.return.passenger}</th>
                        <td>${bookingInfo.return.route}</td>
                        <td>${bookingInfo.return.time}</td>
                        <td>${bookingInfo.return.flight_no}</td>
                        <td>${bookingInfo.return.seat}</td>
                    </tr>
                `;

                // 更新總金額
                document.querySelector('.text-primary').textContent = `總金額：${paymentInfo.amount}`;
            } else {
                // 處理支付失敗情況
                document.querySelector('h2').textContent = paymentInfo.message || '付款失敗';
                document.querySelector('h2').classList.add('text-danger');
                document.getElementById('booking-number').textContent = `錯誤: ${paymentInfo.status}`;
                document.querySelectorAll('table').forEach(table => {
                    table.classList.add('d-none');
                });
            }
        })
        .catch(error => {
            console.error('獲取支付資訊失敗:', error);
        });
});