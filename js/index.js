fetch("../api/flights/list.php")
    .then((res) => {
        return res.text(); // 先拿原始文字內容
    })
    .then((text) => {
        try {
            const data = JSON.parse(text); // 再嘗試解析為 JSON
            if (data.status === "success") {
                const flights = data.flights;

                const fromAirports = flights.map(f => f.from_airport_name);
                const toAirports = flights.map(f => f.to_airport_name);

                setOptions(document.getElementById("departureCityRound1"), fromAirports);
                setOptions(document.getElementById("arrivalCityRound1"), toAirports);
                setOptions(document.getElementById("departureCityRound2"), toAirports);
                setOptions(document.getElementById("arrivalCityRound2"), fromAirports);
                setOptions(document.getElementById("departureCityOneWay"), fromAirports);
                setOptions(document.getElementById("arrivalCityOneWay"), toAirports);
            } else {
                alert("載入航班資料失敗");
            }
        } catch (err) {
            console.error("無法解析為 JSON：", text);
            alert("伺服器回傳錯誤：\n" + text);
        }
    })
    .catch((err) => {
        console.error(err);
        alert("載入資料時發生錯誤");
    });

let selectedStartDate = null;
let selectedEndDate = null;
let tripType = "round";

function initDatePicker() {
    const $datePicker = $("#dateRangePicker");

    $datePicker.off(); // 移除舊事件
    $datePicker.val(""); // 清空顯示
    selectedStartDate = null;
    selectedEndDate = null;

    if (tripType === "round") {
        $datePicker.daterangepicker({
            opens: "right",
            locale: {
                format: "YYYY-MM-DD",
                separator: " 至 ",
                applyLabel: "套用",
                cancelLabel: "取消",
                fromLabel: "從",
                toLabel: "到",
                daysOfWeek: [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六",
                ],
                monthNames: [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月",
                ],
                firstDay: 1,
            },
            autoUpdateInput: false,
        });

        $datePicker.on(
            "apply.daterangepicker",
            function (ev, picker) {
                selectedStartDate =
                    picker.startDate.format("YYYY-MM-DD");
                selectedEndDate =
                    picker.endDate.format("YYYY-MM-DD");
                $(this).val(
                    `${selectedStartDate} 至 ${selectedEndDate}`
                );
            }
        );
    } else if (tripType === "oneway") {
        $datePicker.daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: "YYYY-MM-DD",
                applyLabel: "套用",
                cancelLabel: "取消",
                daysOfWeek: [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六",
                ],
                monthNames: [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月",
                ],
                firstDay: 1,
            },
            autoUpdateInput: false,
        });

        $datePicker.on(
            "apply.daterangepicker",
            function (ev, picker) {
                selectedStartDate =
                    picker.startDate.format("YYYY-MM-DD");
                selectedEndDate = null;
                $(this).val(selectedStartDate);
            }
        );
    }

    $datePicker.on("cancel.daterangepicker", function () {
        $(this).val("");
        selectedStartDate = null;
        selectedEndDate = null;
    });
}

const btnRound = document.getElementById("btnRound");
const btnOneWay = document.getElementById("btnOneWay");
const roundTripDiv = document.getElementById("roundTripSelects");
const oneWayDiv = document.getElementById("oneWaySelects");

function toggleSelects() {
    if (tripType === "round") {
        roundTripDiv.classList.remove("hidden");
        oneWayDiv.classList.add("hidden");
        btnRound.classList.add("active");
        btnOneWay.classList.remove("active");
    } else {
        roundTripDiv.classList.add("hidden");
        oneWayDiv.classList.remove("hidden");
        btnRound.classList.remove("active");
        btnOneWay.classList.add("active");
    }
}

btnRound.addEventListener("click", () => {
    tripType = "round";
    toggleSelects();
    initDatePicker(); // 重新初始化日期區間選擇器
});

btnOneWay.addEventListener("click", () => {
    tripType = "oneway";
    toggleSelects();
    initDatePicker(); // 換成單日選擇器
});

toggleSelects();
initDatePicker();

function setOptions(selectElem, options) {
    selectElem.innerHTML = "";
    [...new Set(options)].forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        selectElem.appendChild(option);
    });
}

fetch("../api/flights/list.php")
    .then((res) => res.json())
    .then((data) => {
        if (data.status === "success") {
            const flights = data.flights;

            const fromAirports = flights.map(
                (f) => f.from_airport_name
            );
            const toAirports = flights.map(
                (f) => f.to_airport_name
            );

            setOptions(
                document.getElementById("departureCityRound1"),
                fromAirports
            );
            setOptions(
                document.getElementById("arrivalCityRound1"),
                toAirports
            );
            setOptions(
                document.getElementById("departureCityRound2"),
                toAirports
            );
            setOptions(
                document.getElementById("arrivalCityRound2"),
                fromAirports
            );
            setOptions(
                document.getElementById("departureCityOneWay"),
                fromAirports
            );
            setOptions(
                document.getElementById("arrivalCityOneWay"),
                toAirports
            );
        } else {
            alert("載入航班資料失敗");
        }
    })
    .catch((err) => {
        console.error(err);
        alert("載入資料時發生錯誤");
    });

let passengerCount = 1;

const passengerCountSpan = document.getElementById("passengerCount");
const btnMinus = document.getElementById("btnMinus");
const btnPlus = document.getElementById("btnPlus");

function updatePassengerDisplay() {
    passengerCountSpan.textContent = passengerCount;
}

btnMinus.addEventListener("click", () => {
    if (passengerCount > 1) {
        passengerCount--;
        updatePassengerDisplay();
    }
});

btnPlus.addEventListener("click", () => {
    passengerCount++;
    updatePassengerDisplay();
});

updatePassengerDisplay(); // 初始化顯示人數

document.getElementById("nextPageBtn").addEventListener("click", async () => {
    const baseParams = {};

    if (selectedStartDate) baseParams.startDate = selectedStartDate;
    if (selectedEndDate) baseParams.endDate = selectedEndDate;
    baseParams.passengerCount = passengerCount;

    if (tripType === "round") {
        baseParams.tripType = "round";
        baseParams.departure1 = document.getElementById("departureCityRound1").value;
        baseParams.arrival1 = document.getElementById("arrivalCityRound1").value;
        baseParams.departure2 = document.getElementById("departureCityRound2").value;
        baseParams.arrival2 = document.getElementById("arrivalCityRound2").value;
        if (baseParams.departure1 === baseParams.arrival1 || baseParams.departure2 === baseParams.arrival2) {
            alert("出發地與目的地不可相同");
            return;
        }
    } else {
        baseParams.tripType = "oneway";
        baseParams.departure = document.getElementById("departureCityOneWay").value;
        baseParams.arrival = document.getElementById("arrivalCityOneWay").value;
        if (baseParams.departure === baseParams.arrival) {
            alert("出發地與目的地不可相同");
            return;
        }
    }
    // POST 傳送選擇資料到 search.php，等待回應再跳轉
    try {
        const res = await fetch("../api/flights/search.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(baseParams)
        });
        const data = await res.json();
        // 可依 data.status 做錯誤處理
        // console.log(baseParams)
        window.location.href = "search.html";
    } catch (err) {
        alert("搜尋失敗，請稍後再試");
        console.error(err);
    }
});
