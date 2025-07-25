//頁面載入時取得資料
document.addEventListener('DOMContentLoaded', () => {
  fetch('../api/flights/search.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(data => {
      renderFlights(data);
      console.log(data);
    })
    .catch(error => {
      console.error('查詢失敗:', error);
    });
});

//根據回傳資料渲染畫面
function renderFlights(data) {
  const isRoundTrip = !!data.outbound && !!data.inbound;

  if (isRoundTrip) {
    document.getElementById('roundTripSection').style.display = 'block';
    document.getElementById('oneWaySection').style.display = 'none';

    renderFlightList(data.outbound, 'flight-containerGo', '去程');
    renderFlightList(data.inbound, 'flight-containerReturn', '回程');

  } else if (data.flights) {
    document.getElementById('roundTripSection').style.display = 'none';
    document.getElementById('oneWaySection').style.display = 'block';

    renderFlightList(data.flights, 'flight-containerOneWayGo', '單程');
  } else {
    document.getElementById('roundTripSection').style.display = 'none';
    document.getElementById('oneWaySection').style.display = 'none';
    document.getElementById('noFlightMessageGo').innerHTML = '查無航班';
  }
}

// 渲染每一筆航班
function renderFlightList(flights, containerId, directionLabel) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';  // 清空

  if (!flights.length) {
    container.innerHTML = `<p class="text-danger">沒有 ${directionLabel} 航班</p>`;
    return;
  }

  flights.forEach((flight, index) => {
    const card = `
      <div class="flight-card">
        <h5>${flight.flight_no} (${flight.class_type})</h5>
        <p>${flight.from_airport_name} ➜ ${flight.to_airport_name}</p>
        <p>出發: ${formatDateTime(flight.departure_time)}</p>
        <p>抵達: ${formatDateTime(flight.arrival_time)}</p>
        <p>價格: $${flight.price}</p>
        <p>座位剩餘: ${flight.seats_available}</p>
        <button onclick="selectFlight('${flight.id}', '${flight.class_type}', '${directionLabel}', ${index})">
          選擇
        </button>
      </div>
    `;
    container.innerHTML += card;
  });
}

//格式化日期
function formatDateTime(datetimeStr) {
  const dt = new Date(datetimeStr);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${dt.getHours()}:${String(dt.getMinutes()).padStart(2, '0')}`;
}


//點選航班後的行為
function selectFlight(flightId, classType, direction, index) {
  console.log(`使用者選擇了 ${direction} 第 ${index + 1} 筆航班，ID: ${flightId}, 類型: ${classType}`);
  // 你可以在這裡用 fetch 或 AJAX POST 傳回後端儲存 session
}

