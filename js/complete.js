document.addEventListener('DOMContentLoaded', () => {
    fetch('../api/confirm/get_payment_info.php')
        .then(res => res.json())
        .then(data => {
            console.log("訂單資料：", data);

            const booking = data.booking_info || {};
            const flights = booking.flights || {};
            const payment = data.payment_info || {};

            const tripType = flights.tripType || "oneway";
            const departSection = document.getElementById("depart-section");
            const returnSection = document.getElementById("return-section");

            // 顯示欄位控制
            if (tripType === "oneway") {
                departSection.classList.remove("d-none");
                returnSection.classList.add("d-none");
            } else if (tripType === "round") {
                departSection.classList.remove("d-none");
                returnSection.classList.remove("d-none");
            }

            // 訂單編號與總金額
            document.getElementById("booking-number").textContent = `訂單編號：${payment.order_id}`;
            document.getElementById("final-price").textContent = `總金額：${payment.amount}`;

            // 資料填入 table
            renderFlightTable("depart", flights.outbound, booking.addons, booking.passenger_info);
            if (tripType === "round") {
                renderFlightTable("return", flights.inbound, booking.addons, booking.passenger_info);
            }
        })
        .catch(error => {
            console.error("❌ 載入訂單資料失敗：", error);
        });
});

// 動態渲染去／回程 table
function renderFlightTable(tableId, flightData, addons, passengerInfo) {
    const tbody = document.getElementById(tableId);
    if (!tbody || !flightData || !addons || !passengerInfo) return;

    const rows = [];
    const directionMap = {
        depart: "outbound",
        return: "return"
    };
    const segmentKey = directionMap[tableId];

    // 處理會員本人
    const main = passengerInfo.main_user || {};
    const fullName = `${main.passport_last_name || ''} ${main.passport_first_name || ''}`;
    const addon = addons.find(a => a.passenger === 1);
    const segment = addon?.[segmentKey] || {};
    rows.push(createTableRow(fullName, flightData, segment));

    // 處理同行旅客
    (passengerInfo.passenger || []).forEach((p, i) => {
        const name = `${p.passport_last_name || ''} ${p.passport_first_name || ''}`;
        const addon = addons.find(a => a.passenger === i + 2);
        const segment = addon?.[segmentKey] || {};
        rows.push(createTableRow(name, flightData, segment));
    });

    tbody.innerHTML = rows.join('');
}


function createTableRow(name, flight, addon = {}) {
    const route = `${flight.from_airport_name} → ${flight.to_airport_name}`;
    const time = `${formatTime(flight.departure_time)} / ${formatTime(flight.arrival_time)}`;
    const seat = addon.seat || "—";
    return `
    <tr>
      <th>${name}</th>
      <td>${route}</td>
      <td>${time}</td>
      <td>${flight.flight_no}</td>
      <td>${seat}</td>
    </tr>
  `;
}

function formatTime(datetime) {
    return datetime?.replace("T", " ").slice(0, 16) || "--";
}
