let flightsGo = [];
let flightsReturn = [];
const itemsPerPage = 2;
let currentPageGo = 1;
let currentPageReturn = 1;
let currentPageOneWayGo = 1;
let currentPageOneWayReturn = 1;
let selectedOutbound = null;
let selectedReturn = null;

// 取得 URL Query 參數
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 根據 tripType 顯示對應區塊
// 顯示無航班訊息
function showFlightSection(type) {
    // 先隱藏所有無航班訊息
    document.getElementById('noFlightMessageGo').style.display = 'none';
    document.getElementById('noFlightMessageReturn').style.display = 'none';
    document.getElementById('noFlightMessageOneWay').style.display = 'none';

    if (type === 'round') {
        document.getElementById('roundTripSection').style.display = 'block';
        document.getElementById('oneWaySection').style.display = 'none';
        goToPageGo(currentPageGo);
        goToPageReturn(currentPageReturn);
    } else {
        document.getElementById('roundTripSection').style.display = 'none';
        document.getElementById('oneWaySection').style.display = 'block';
        goToPageOneWay(1);
        selectedReturn = null;
        document.querySelectorAll('.OutboundRightTicket[data-direction="inbound"]').forEach(btn => btn.classList.remove('active'));
    }

    // 呼叫顯示無航班訊息函式
    showNoFlightMessage(type);
}

function goToPageGo(page) {
    currentPageGo = page;
    renderFlights('flight-containerGo', flightsGo, currentPageGo, 'outbound');
    renderPagination('PaginationControlsGo', flightsGo.length, currentPageGo, 'goToPageGo');
}

function goToPageReturn(page) {
    currentPageReturn = page;
    renderFlights('flight-containerReturn', flightsReturn, currentPageReturn, 'inbound');
    renderPagination('PaginationControlsReturn', flightsReturn.length, currentPageReturn, 'goToPageReturn');
}




const roundTripSection = document.getElementById('roundTripSection');
const oneWaySection = document.getElementById('oneWaySection');


initFlightData();

// 載入並初始化航班資料
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 顯示對應區塊並渲染頁面
// 顯示「無航班訊息」
function showNoFlightMessage(type) {
    const noFlightGo = document.getElementById('noFlightMessageGo');
    const noFlightReturn = document.getElementById('noFlightMessageReturn');
    const noFlightOneWay = document.getElementById('noFlightMessageOneWay');

    noFlightGo.innerText = '';
    noFlightReturn.innerText = '';
    noFlightOneWay.innerText = '';

    if (type === 'round') {
        if (flightsGo.length === 0) {
            noFlightGo.innerText = '查無去程航班，請改其他時段';
            noFlightGo.style.display = 'block';
        }
        if (flightsReturn.length === 0) {
            noFlightReturn.innerText = '查無回程航班，請改其他時段';
            noFlightReturn.style.display = 'block';
        }
    } else {
        if (flightsGo.length === 0 && flightsReturn.length === 0) {
            noFlightOneWay.innerText = '查無單程航班，請改其他時段';
            noFlightOneWay.style.display = 'block';
        }
    }
}

function showFlightSection(tripType) {
    // 隱藏所有無航班訊息
    document.getElementById('noFlightMessageGo').style.display = 'none';
    document.getElementById('noFlightMessageReturn').style.display = 'none';
    document.getElementById('noFlightMessageOneWay').style.display = 'none';

    if (tripType === 'round') {
        roundTripSection.style.display = 'block';
        oneWaySection.style.display = 'none';
        goToPageGo(currentPageGo);
        goToPageReturn(currentPageReturn);
    } else {
        roundTripSection.style.display = 'none';
        oneWaySection.style.display = 'block';
        goToPageOneWay(1);
        selectedReturn = null;
        document.querySelectorAll('.OutboundRightTicket[data-direction="inbound"]').forEach(btn => btn.classList.remove('active'));
    }

    // 顯示無航班訊息
    showNoFlightMessage(tripType);
}

// 載入並初始化航班資料
function initFlightData() {
    const tripType = getQueryParam('tripType') || 'round';

    // 先隱藏所有無航班訊息
    document.getElementById('noFlightMessageGo').style.display = 'none';
    document.getElementById('noFlightMessageReturn').style.display = 'none';
    document.getElementById('noFlightMessageOneWay').style.display = 'none';

    fetch('../api/flights/search.php' + window.location.search)
        .then(res => res.json())
        .then(data => {
            if (data.outbound && data.inbound) {
                flightsGo = data.outbound;
                flightsReturn = data.inbound;
            } else {
                flightsGo = [];
                flightsReturn = [];
            }

            showFlightSection(tripType);
            setupNextButton(tripType);
            setupCartToggle();
        })
        .catch(err => {
            console.error('資料載入錯誤：', err);
            alert('無法載入航班資料，請稍後再試。');
        });
}

// 頁面初始化
initFlightData();

// 去程分頁渲染
function goToPageGo(page) {
    currentPageGo = page;
    renderFlights('flight-containerGo', flightsGo, currentPageGo);
    renderPagination('PaginationControlsGo', flightsGo.length, currentPageGo, 'goToPageGo');
}

// 回程分頁渲染
function goToPageReturn(page) {
    currentPageReturn = page;
    renderFlights('flight-containerReturn', flightsReturn, currentPageReturn);
    renderPagination('PaginationControlsReturn', flightsReturn.length, currentPageReturn, 'goToPageReturn');
}

// 單程分頁渲染
function goToPageOneWay(page) {
    renderFlights('flight-containerOneWayGo', flightsGo, page);
    renderPagination('PaginationControlsOneWayGo', flightsGo.length, page, 'goToPageOneWayGo');

    renderFlights('flight-containerOneWayReturn', flightsReturn, page);
    renderPagination('PaginationControlsOneWayReturn', flightsReturn.length, page, 'goToPageOneWayReturn');
}

// 去程單程分頁
function goToPageOneWayGo(page) {
    renderFlights('flight-containerOneWayGo', flightsGo, page);
    renderPagination('PaginationControlsOneWayGo', flightsGo.length, page, 'goToPageOneWayGo');
}

// 回程單程分頁
function goToPageOneWayReturn(page) {
    renderFlights('flight-containerOneWayReturn', flightsReturn, page);
    renderPagination('PaginationControlsOneWayReturn', flightsReturn.length, page, 'goToPageOneWayReturn');
}


// 渲染航班清單（支援去程或回程）
function renderFlights(containerId, data, page) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = data.slice(start, end);

    pageItems.forEach(flight => {
        if (!flight || !flight.class_details) return;

        const div = document.createElement('div');
        let buttonsHTML = '';

        flight.class_details.forEach(cls => {
            buttonsHTML += `
            <div class="btn OutboundRightTicket"
                 data-id="${flight.id}"
                 data-direction="${flight.direction}"
                 data-class="${cls.class_type}">
                 ${cls.class_type.toUpperCase()}<br>$${cls.price}
            </div>`;
        });

        div.innerHTML = `
            <div class="Outbound">
                <div class="OutboundLeft">
                    <p>當地時間為 <br><strong>${flight.departure.time}</strong></p>
                    <p>${flight.from_airport} - ${flight.departure.city}</p>
                </div>
                <div class="OutboundLeftCenter">
                    ${flight.center}
                    <img src="../assets/images/Line%206.svg" alt="flight path" class="FlightLine">
                </div>
                <div class="OutboundLeft">
                    <p>當地時間為 <strong><br>${flight.arrival.time}</strong></p>
                    <p>${flight.to_airport} - ${flight.arrival.city}</p>
                </div>
                <div class="OutboundRight">
                    ${buttonsHTML}
                </div>
            </div><br>
        `;
        container.appendChild(div);
    });

    bindFlightSelectEvents();
}


// 綁定航班選擇按鈕事件
function bindFlightSelectEvents() {
    document.querySelectorAll('.OutboundRightTicket').forEach(btn => {
        btn.addEventListener('click', () => {
            const flightId = btn.dataset.id;
            const direction = btn.dataset.direction;
            const selectedClass = btn.dataset.class;

            const flightArray = direction === 'outbound' ? flightsGo : flightsReturn;
            const selectedFlight = flightArray.find(f => String(f.id) === flightId);
            const classDetail = selectedFlight?.class_details.find(cls => cls.class_type === selectedClass);

            if (!selectedFlight || !classDetail) return;

            const selectedData = {
                ...selectedFlight,
                selectedClass,
                selectedPrice: classDetail.price
            };

            if (direction === 'outbound') {
                selectedOutbound = selectedData;
            } else {
                selectedReturn = selectedData;
            }

            // 樣式切換
            document.querySelectorAll(`.OutboundRightTicket[data-direction="${direction}"]`)
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            updateNextButton();
        });
    });
}

// 分頁元件渲染
function renderPagination(containerId, totalItems, currentPageVar, onPageChangeFn) {
    const pagination = document.getElementById(containerId);
    if (!pagination) return;

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

// 更新已選航班資訊顯示
function updateSelectedFlightInfo() {
    const infoBox = document.querySelector('.SelectedFlightsInfo');
    infoBox.innerHTML = '';

    if (selectedOutbound) {
        const { departure, arrival } = selectedOutbound;
        infoBox.innerHTML += `<p>去程：${departure.city} ${departure.time} → ${arrival.city} ${arrival.time}</p>`;
    }
    if (selectedReturn) {
        const { departure, arrival } = selectedReturn;
        infoBox.innerHTML += `<p>回程：${departure.city} ${departure.time} → ${arrival.city} ${arrival.time}</p>`;
    }

    updateTotalPrice();
}

// 計算並顯示總價格
function updateTotalPrice() {
    const priceBox = document.querySelector('.SelectedPrices');
    let total = 0;
    if (selectedOutbound) total += selectedOutbound.selectedPrice;
    if (selectedReturn) total += selectedReturn.selectedPrice;
    priceBox.innerHTML = `<p>總價：$${total.toLocaleString()}</p>`;
}

// 下一步按鈕狀態控制
function updateNextButton() {
    const nextBtn = document.getElementById('NextButton');
    const tripType = getQueryParam('tripType') || 'round';

    nextBtn.disabled = tripType === 'round'
        ? !(selectedOutbound && selectedReturn)
        : !selectedOutbound;

    updateSelectedFlightInfo();
}

// 綁定下一步按鈕點擊事件
function setupNextButton(tripType) {
    document.getElementById('NextButton').addEventListener('click', () => {
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
}

// 購物車圖示顯示選擇資訊切換
let cartToggleBound = false;

function setupCartToggle() {
    if (cartToggleBound) return;
    cartToggleBound = true;

    const cartIcon = document.getElementById('cartIcon');
    const infoBox = document.querySelector('.SelectedFlightsInfo');

    cartIcon.addEventListener('click', () => {
        const isVisible = infoBox.style.display === 'block';
        if (!selectedOutbound && !selectedReturn) {
            alert('您尚未選擇航班！');
            return;
        }
        infoBox.style.display = isVisible ? 'none' : 'block';
        updateSelectedFlightInfo();
    });
}


// 頁面初始化
initFlightData();
