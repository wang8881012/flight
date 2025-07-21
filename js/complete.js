// 這個檔案是接取complete.php資料並動態渲染
function showLoading() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function showError(message) {
    const container = document.querySelector('.container-fluid');
    container.innerHTML = `
        <div class="alert alert-danger">
            <h2>發生錯誤</h2>
            <p>${message}</p>
            <a href="/" class="btn btn-primary">返回首頁</a>
        </div>
    `;
}

function formatTime(datetime) {
    if (!datetime) return '';
    const date = new Date(datetime);
    return date.toLocaleString('zh-TW', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/\//g, '/');
}

// 主要資料更新函數
function updatePageWithData(order, paymentStatus) {
    if (paymentStatus !== 'success') {
        document.querySelector('h2').textContent = '付款失敗';
        document.querySelector('h2').className = 'text-center text-danger';
        return;
    }

    // 更新基本訂單資訊
    document.getElementById('booking-number').textContent = `訂單編號：${order.order_no}`;
    document.querySelector('.text-primary').textContent = `總金額：${order.total_price}`;

    // 更新去程航班資訊
    const departTbody = document.getElementById('depart');
    if (order.depart_flight_no) {
        departTbody.innerHTML = `
            <tr>
                <th>旅客姓名</th>
                <td>${order.depart_from} / ${order.depart_to}</td>
                <td>${formatTime(order.depart_time)} / ${formatTime(order.depart_arrival)}</td>
                <td>${order.depart_flight_no}</td>
                <td>待分配</td>
            </tr>
        `;
    }

    // 更新回程航班資訊
    const returnTbody = document.getElementById('return');
    if (order.return_flight_no) {
        returnTbody.innerHTML = `
            <tr>
                <th>旅客姓名</th>
                <td>${order.return_from} / ${order.return_to}</td>
                <td>${formatTime(order.return_time)} / ${formatTime(order.return_arrival)}</td>
                <td>${order.return_flight_no}</td>
                <td>待分配</td>
            </tr>
        `;
    }
}

// 頁面初始化邏輯
function initPaymentCompletePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('booking_id');
    
    if (!bookingId) {
        showError('缺少訂單編號');
        return;
    }

    showLoading();
    
    fetch(`/api/complete.php?booking_id=${bookingId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(window.location.search).toString()
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updatePageWithData(data.order, data.payment_status);
        } else {
            showError(data.error || '付款處理失敗');
        }
    })
    .catch(error => {
        showError('網路錯誤: ' + error.message);
    })
    .finally(() => {
        hideLoading();
    });
}

// 當DOM載入完成時初始化
document.addEventListener('DOMContentLoaded', initPaymentCompletePage);