const bookingId = 2;

document.addEventListener('DOMContentLoaded', () => {
    // 這裡改成你的 booking_id

    fetch(`../api/confirm/getBooking.php?booking_id=${bookingId}`)
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                renderBooking(result.data);
            } else {
                console.error('資料取得失敗', result.message);
            }
        })
        .catch(error => {
            console.error('發生錯誤', error);
        });
});


function renderBooking(data) {
    const orderNumber = document.getElementById('booking-number')
    const departTableBody = document.getElementById('depart');
    const returnTableBody = document.getElementById('return');
    
    // 清空原本的內容
    orderNumber.innerHTML = '';
    departTableBody.innerHTML = '';
    returnTableBody.innerHTML = '';

    // 這裡直接將資料平均分配，一半放去程，一半放回程（模擬情境）
    const half = Math.ceil(data.length / 2);
    const departData = data.slice(0, half);
    const returnData = data.slice(half);

    //渲染訂單編號
    orderNumber.innerHTML = `<h4>訂單編號：${bookingId}</h4>`

    // 渲染去程
    departData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <th>${item.passenger}</th>
                <td>${item.from_airport} → ${item.to_airport}</td>
                <td>${formatDate(item.departure_time)} ~ ${formatDate(item.arrival_time)}</td>
                <td>${item.flight_no}</td>
                <td>${item.seat_number}</td>
            `;
        departTableBody.appendChild(row);
    });

    // 渲染回程
    returnData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <th>${item.passenger}</th>
                <td>${item.from_airport} → ${item.to_airport}</td>
                <td>${formatDate(item.departure_time)} ~ ${formatDate(item.arrival_time)}</td>
                <td>${item.flight_no}</td>
                <td>${item.seat_number}</td>
            `;
        returnTableBody.appendChild(row);
    });
}

function formatDate(datetime) {
    const date = new Date(datetime);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}
