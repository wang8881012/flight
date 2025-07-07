const flights = [
    { departure: { city: '台北', time: '07:00' }, center: '1h 40m', arrival: { city: '東京', time: '11:30' }, buttons: ['$2700', '$2700'] },
    { departure: { city: '高雄', time: '09:45' }, center: '2h 40m', arrival: { city: '大阪', time: '13:20' }, buttons: ['$2700', '$2700'] },
    { departure: { city: '台北', time: '06:00' }, center: '3h 40m', arrival: { city: '東京', time: '11:30' }, buttons: ['$2700', '$3700'] },
    { departure: { city: '高雄', time: '09:45' }, center: '4h 40m', arrival: { city: '大阪', time: '13:20' }, buttons: ['$2700', '$2700'] },
    { departure: { city: '花蓮', time: '10:00' }, center: '5h 10m', arrival: { city: '首爾', time: '12:30' }, buttons: ['$2700', '$2700'] },
    { departure: { city: '台中', time: '08:30' }, center: '6h 15m', arrival: { city: '名古屋', time: '11:00' }, buttons: ['$4700', '$2700'] },
    { departure: { city: '高雄', time: '09:45' }, center: '7h 40m', arrival: { city: '大阪', time: '13:20' }, buttons: ['$2700', '$2700'] },
    { departure: { city: '花蓮', time: '10:00' }, center: '5h 10m', arrival: { city: '首爾', time: '12:30' }, buttons: ['$2700', '$5700'] },
    { departure: { city: '台中', time: '08:30' }, center: '2h 15m', arrival: { city: '名古屋', time: '11:00' }, buttons: ['$7700', '$2700'] },
];

const flightsGo = [...flights];
const itemsPerPage = 2;
let currentPage = 1;
let currentPageGo = 1;
let selectedOutbound = null;
let selectedReturn = null;

function updateSelectedFlightInfo() {
    const infoBox = document.querySelector('.SelectedFlightsInfo');
    infoBox.innerHTML = '';

    if (selectedOutbound) {
        const { departure, arrival } = selectedOutbound;
        infoBox.innerHTML += `<p>去程：${departure.city} (${departure.time}) → ${arrival.city} (${arrival.time})</p>`;
    }

    if (selectedReturn) {
        const { departure, arrival } = selectedReturn;
        infoBox.innerHTML += `<p>回程：${departure.city} (${departure.time}) → ${arrival.city} (${arrival.time})</p>`;
    }

    updateTotalPrice(); // 🔹更新價格顯示
}

function updateTotalPrice() {
    const priceBox = document.querySelector('.SelectedPrices');
    let total = 0;

    const parsePrice = (str) => parseInt(str.replace('$', ''));

    if (selectedOutbound) {
        total += parsePrice(selectedOutbound.buttons[1]);
    }

    if (selectedReturn) {
        total += parsePrice(selectedReturn.buttons[1]);
    }

    priceBox.innerHTML = `<p>總價：$${total}</p>`;
}

function updateNextButton() {
    const nextBtn = document.getElementById('NextButton');
    nextBtn.disabled = !(selectedOutbound && selectedReturn);
    updateSelectedFlightInfo();
}

function renderFlights(containerId, data, page) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = data.slice(start, end);

    pageItems.forEach((flight, index) => {
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
              <div class="btn OutboundRightTicket" data-index="${index}" data-type="price">${flight.buttons[0]}</div>
              <div class="btn OutboundRightTicket" data-index="${index}" data-type="select">${flight.buttons[1]}</div>
            </div>
          </div><br>
        `;
        container.appendChild(div);
    });

    const allButtons = container.querySelectorAll('.OutboundRightTicket');
    allButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            allButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const index = parseInt(btn.getAttribute('data-index'));
            const flight = pageItems[index];

            if (containerId === 'flight-container') {
                selectedOutbound = flight;
            } else {
                selectedReturn = flight;
            }

            updateNextButton();
        });
    });

    updateNextButton();
}

function renderPagination(containerId, totalItems, currentPageVar, onPageChangeFn) {
    const pagination = document.getElementById(containerId);
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    pagination.innerHTML += `
        <button onclick="${onPageChangeFn}(1)"><i class="bi bi-rewind-btn-fill"></i></button>
        <button onclick="${onPageChangeFn}(${Math.max(1, currentPageVar - 1)})"><i class="bi bi-skip-start-btn-fill"></i></button>
      `;

    let start = Math.max(1, currentPageVar - 1);
    let end = Math.min(totalPages, start + 2);
    if (end - start < 2) start = Math.max(1, end - 2);

    for (let i = start; i <= end; i++) {
        const activeClass = i === currentPageVar ? 'btn-active' : 'btn-inactive';
        pagination.innerHTML += `<button class="btn ${activeClass}" onclick="${onPageChangeFn}(${i})">${i}</button>`;
    }

    pagination.innerHTML += `
        <button onclick="${onPageChangeFn}(${Math.min(totalPages, currentPageVar + 1)})"><i class="bi bi-skip-end-btn-fill"></i></button>
        <button onclick="${onPageChangeFn}(${totalPages})"><i class="bi bi-fast-forward-btn-fill"></i></button>
      `;
}

function goToPage(page) {
    currentPage = page;
    renderFlights('flight-container', flights, currentPage);
    renderPagination('PaginationControls', flights.length, currentPage, 'goToPage');
}

function goToPageGo(page) {
    currentPageGo = page;
    renderFlights('flight-containerGo', flightsGo, currentPageGo);
    renderPagination('PaginationControlsGo', flightsGo.length, currentPageGo, 'goToPageGo');
}

window.onload = () => {
    goToPage(currentPage);
    goToPageGo(currentPageGo);

    document.getElementById('NextButton').addEventListener('click', () => {
        if (selectedOutbound && selectedReturn) {
            alert('進入下一步！');
            // 可導向下一頁
        }
    });

    document.getElementById('cartIcon').addEventListener('click', () => {
        const infoBox = document.querySelector('.SelectedFlightsInfo');
        const isVisible = infoBox.style.display === 'block';

        if (!selectedOutbound && !selectedReturn) {
            alert('您尚未選擇航班！');
            return;
        }

        infoBox.style.display = isVisible ? 'none' : 'block';
        updateSelectedFlightInfo();
    });

    updateNextButton();
};
