function showFlightSection(type) {
    const roundTripSection = document.getElementById('roundTripSection');
    const oneWaySection = document.getElementById('oneWaySection');

    if (type === 'round') {
        roundTripSection.style.display = 'block';
        oneWaySection.style.display = 'none';
        goToPageGo(currentPageGo);
        goToPage(currentPage);
    } else {
        roundTripSection.style.display = 'none';
        oneWaySection.style.display = 'block';
        goToPageOneWay(1);

        // 清空回程選擇
        selectedReturn = null;

        // 移除所有回程航班的 active 樣式
        const returnButtons = document.querySelectorAll('.OutboundRightTicket[data-direction="inbound"]');
        returnButtons.forEach(btn => btn.classList.remove('active'));
    }
}

window.onload = () => {
    showFlightSection(document.getElementById('tripType').value); // 根據預設選項載入
};
let flights = [];
let flightsGo = [];
let flightsReturn = [];
const itemsPerPage = 2;
let currentPage = 1;
let currentPageGo = 1;
let selectedOutbound = null;
let selectedReturn = null;

// 從伺服器獲取航班資料
fetch('/project/flight/project/src/php/search.php')
    .then(res => res.json())
    .then(data => {
        console.log('成功获取数据：', data.flights);

        flights = data.flights;
        flightsGo = flights.filter(f => f.direction === 'outbound');
        flightsReturn = flights.filter(f => f.direction === 'inbound');

        goToPage(currentPage);
        goToPageGo(currentPageGo);
    })
    .catch(err => console.error('資料載入錯誤：', err));

// 更新已選航班資訊
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

    updateTotalPrice();
}

// 更新總價格
function updateTotalPrice() {
    const priceBox = document.querySelector('.SelectedPrices');
    let total = 0;

    if (selectedOutbound) {
        total += selectedOutbound.selectedPrice;
    }

    if (selectedReturn) {
        total += selectedReturn.selectedPrice;
    }

    priceBox.innerHTML = `<p>總價：$${total.toLocaleString()}</p>`;
}

// 更新「下一步」按鈕狀態
function updateNextButton() {
    const nextBtn = document.getElementById('NextButton');
    const tripType = document.getElementById('tripType').value;

    if (tripType === 'round') {
        nextBtn.disabled = !(selectedOutbound && selectedReturn);
    } else {
        nextBtn.disabled = !selectedOutbound;
    }

    updateSelectedFlightInfo();
}



// 渲染航班清單
function renderFlights(containerId, data, page) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`找不到容器：${containerId}`);
        return;
    }

    container.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = data.slice(start, end);

    pageItems.forEach((flight) => {
        const div = document.createElement('div');

        let buttonsHTML = '';
        (flight.class_details || []).forEach((cls, index) => {
            const priceLabel = flight.buttons[index] || '';
            buttonsHTML += `
          <div class="btn OutboundRightTicket"
               data-id="${flight.id}"
               data-type="select"
               data-direction="${flight.direction}"
               data-class="${cls.class_type}">
               ${cls.class_type.toUpperCase()} 
               <br>
               ${priceLabel}
          </div>`;
        });

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
          ${buttonsHTML}
        </div>
      </div><br>
    `;
        container.appendChild(div);
    });


    //綁定事件：點擊價格或選擇按鈕
    const allButtons = container.querySelectorAll('.OutboundRightTicket');
    allButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const flightId = parseInt(btn.getAttribute('data-id'));
            const direction = btn.getAttribute('data-direction');
            const selectedClass = btn.getAttribute('data-class');

            const selectedFlight = (direction === 'outbound' ? flightsGo : flightsReturn).find(f => f.id === flightId);
            if (!selectedFlight) return;

            const selectedPrice = selectedFlight.class_details.find(cls => cls.class_type === selectedClass).price;

            if (direction === 'outbound') {
                selectedOutbound = {
                    ...selectedFlight,
                    selectedClass,
                    selectedPrice
                };
            } else {
                selectedReturn = {
                    ...selectedFlight,
                    selectedClass,
                    selectedPrice
                };
            }

            //取消同方向所有 active，再加上被點擊的
            allButtons.forEach(b => {
                if (b.getAttribute('data-direction') === direction) {
                    b.classList.remove('active');
                }
            });
            btn.classList.add('active');

            updateNextButton();
        });
    });

    updateNextButton();
}

// 渲染分頁
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

// 去程頁切換
function goToPageGo(page) {
    currentPageGo = page;
    renderFlights('flight-containerGo', flightsGo, currentPageGo);
    renderPagination('PaginationControlsGo', flightsGo.length, currentPageGo, 'goToPageGo');
}

// 回程頁切換
function goToPage(page) {
    currentPage = page;
    renderFlights('flight-container', flightsReturn, currentPage);
    renderPagination('PaginationControls', flightsReturn.length, currentPage, 'goToPage');
}
// 單程頁切換
function goToPageOneWay(page) {
    const oneWayFlights = flights.filter(f => f.direction === 'outbound');
    renderFlights('flight-containerOneWay', oneWayFlights, page);
    renderPagination('PaginationControlsOneWay', oneWayFlights.length, page, 'goToPageOneWay');
}

// 初始化與事件綁定
window.onload = () => {
    const tripType = document.getElementById('tripType').value;
    showFlightSection(tripType);

    document.getElementById('NextButton').addEventListener('click', () => {
        const tripType = document.getElementById('tripType').value;

        if (tripType === 'round' && selectedOutbound && selectedReturn) {
            localStorage.setItem('selectedOutbound', JSON.stringify(selectedOutbound));
            localStorage.setItem('selectedReturn', JSON.stringify(selectedReturn));
            localStorage.setItem('tripType', 'round');
            window.location.href = 'nextPage.html';
        } else if (tripType === 'oneway' && selectedOutbound) {
            localStorage.setItem('selectedOutbound', JSON.stringify(selectedOutbound));
            localStorage.removeItem('selectedReturn');
            localStorage.setItem('tripType', 'oneway');
            window.location.href = 'nextPage.html';
        } else {
            alert('請選擇航班');
        }
    });


    // 購物車圖示事件
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
}
