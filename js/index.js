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

document
    .getElementById("nextPageBtn")
    .addEventListener("click", () => {
        let url;
        const baseParams = {};

        if (selectedStartDate) {
            baseParams.startDate = selectedStartDate;
        }
        if (selectedEndDate) {
            baseParams.endDate = selectedEndDate;
        }

        if (tripType === "round") {
            const d1 = document.getElementById(
                "departureCityRound1"
            ).value;
            const a1 =
                document.getElementById("arrivalCityRound1").value;
            const d2 = document.getElementById(
                "departureCityRound2"
            ).value;
            const a2 =
                document.getElementById("arrivalCityRound2").value;

            if (d1 === a1 || d2 === a2) {
                alert("出發地與目的地不可相同");
                return;
            }

            const params = new URLSearchParams({
                ...baseParams,
                tripType: "round",
                departure1: d1,
                arrival1: a1,
                departure2: d2,
                arrival2: a2,
            });

            url = `search.html?${params.toString()}`;
        } else {
            const d = document.getElementById(
                "departureCityOneWay"
            ).value;
            const a =
                document.getElementById("arrivalCityOneWay").value;

            if (d === a) {
                alert("出發地與目的地不可相同");
                return;
            }

            const params = new URLSearchParams({
                ...baseParams,
                tripType: "oneway",
                departure: d,
                arrival: a,
            });

            url = `search.html?${params.toString()}`;
        }

        window.location.href = url;
    });

// 選擇人數
let passengerCount =
    parseInt(localStorage.getItem("passengerCount")) || 1;

const passengerCountSpan =
    document.getElementById("passengerCount");
const btnMinus = document.getElementById("btnMinus");
const btnPlus = document.getElementById("btnPlus");

function updatePassengerDisplay() {
    passengerCountSpan.textContent = passengerCount;
    localStorage.setItem("passengerCount", passengerCount);
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
