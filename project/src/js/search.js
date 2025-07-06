// 假資料
const flights = [
    { departure: { city: '台北', time: '07:00' }, center: '1h 40m', arrival: { city: '東京', time: '11:30' }, buttons: ['$2500', '選擇'] },
    { departure: { city: '高雄', time: '09:45' }, center: '2h 40m', arrival: { city: '大阪', time: '13:20' }, buttons: ['$3200', '選擇'] },
    { departure: { city: '台北', time: '06:00' }, center: '3h 40m', arrival: { city: '東京', time: '11:30' }, buttons: ['$2500', '選擇'] },
    { departure: { city: '高雄', time: '09:45' }, center: '4h 40m', arrival: { city: '大阪', time: '13:20' }, buttons: ['$3200', '選擇'] },
    { departure: { city: '花蓮', time: '10:00' }, center: '5h 10m', arrival: { city: '首爾', time: '12:30' }, buttons: ['$3100', '選擇'] },
    { departure: { city: '台中', time: '08:30' }, center: '6h 15m', arrival: { city: '名古屋', time: '11:00' }, buttons: ['$2700', '選擇'] },
    { departure: { city: '高雄', time: '09:45' }, center: '7h 40m', arrival: { city: '大阪', time: '13:20' }, buttons: ['$3200', '選擇'] },
    { departure: { city: '花蓮', time: '10:00' }, center: '5h 10m', arrival: { city: '首爾', time: '12:30' }, buttons: ['$3100', '選擇'] },
    { departure: { city: '台中', time: '08:30' }, center: '2h 15m', arrival: { city: '名古屋', time: '11:00' }, buttons: ['$2700', '選擇'] },
];

let currentPage = 1;
const itemsPerPage = 2;
const totalPages = Math.ceil(flights.length / itemsPerPage);

// 渲染航班內容
function renderFlights() {
    const container = document.getElementById('flight-container');
    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = flights.slice(start, end);

    pageItems.forEach(flight => {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="Outbound">
            <div class="OutboundLeft">
                <p><strong>${flight.departure.time}</strong></p>
                <p>${flight.departure.city}</p>
            </div>
            <div class="OutboundLeftCenter">
                ${flight.center}
                <img src="../photo/Line 6.svg" alt="flight path" class="FlightLine">
            </div>
            <div class="OutboundLeft">
                <p><strong>${flight.arrival.time}</strong></p>
                <p>${flight.arrival.city}</p>
            </div>
            <div class="OutboundRight">
                <div class="btn OutboundRightTicket">${flight.buttons[0]}</div>
                <div class="btn OutboundRightTicket">${flight.buttons[1]}</div>
            </div>
        </div><br>
        `;
        container.appendChild(div);
    });
}

// 渲染分頁按鈕（最多顯示 3 個頁碼）
function renderPagination() {
    const pagination = document.getElementById('pagination-controls');
    pagination.innerHTML = '';

    pagination.innerHTML += `
        <button onclick="goToPage(1)"><i class="bi bi-rewind-btn-fill"></i></button>
        <button onclick="goToPage(${Math.max(1, currentPage - 1)})"><i class="bi bi-skip-start-btn-fill"></i></button>
    `;

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);
    if (end - start < 2) start = Math.max(1, end - 2);

    for (let i = start; i <= end; i++) {
        const activeClass = i === currentPage ? 'btn-active' : 'btn-inactive';
        pagination.innerHTML += `
  <button class="btn ${activeClass}" onclick="goToPage(${i})">${i}</button>
`;
    }

    pagination.innerHTML += `
        <button onclick="goToPage(${Math.min(totalPages, currentPage + 1)})"><i class="bi bi-skip-end-btn-fill"></i></button>
        <button onclick="goToPage(${totalPages})"><i class="bi bi-fast-forward-btn-fill"></i></button>
    `;
}

// 切換分頁
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderFlights();
    renderPagination();
}

// 初始化
window.onload = () => {
    renderFlights();
    renderPagination();
};
