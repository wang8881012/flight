// ---- 全域狀態 ----
let currentData = null; // 從 API 拿到的整包資料（含 outbound / inbound / flights）
let selected = {
  outbound: null, // { id, class_type, price, ... }
  inbound: null,
  oneway: null,
};
let passengerCount = 1; // 從後端回傳帶出來

// ---- 頁面載入：拿資料 ----
document.addEventListener("DOMContentLoaded", () => {
  fetch("../api/flights/get_search_result.php", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error("錯誤：", data.error);
        return;
      }

      currentData = data.searchResult;
      passengerCount = data.passengerCount || 1;

      renderFlights(data.searchResult);
      bindCartButton();
      bindNextButton();
    })
    .catch((err) => {
      console.error("查詢失敗：", err);
    });
});

// ---- 渲染整體畫面 ----
function renderFlights(data) {
  const isRoundTrip = !!data.outbound && !!data.inbound;

  if (isRoundTrip) {
    document.getElementById("roundTripSection").style.display = "block";
    document.getElementById("oneWaySection").style.display = "none";

    renderFlightList(data.outbound, "flight-containerGo", "outbound");
    renderFlightList(data.inbound, "flight-containerReturn", "inbound");
  } else if (data.flights) {
    document.getElementById("roundTripSection").style.display = "none";
    document.getElementById("oneWaySection").style.display = "block";

    renderFlightList(data.flights, "flight-containerOneWayGo", "oneway");
  } else {
    document.getElementById("roundTripSection").style.display = "none";
    document.getElementById("oneWaySection").style.display = "none";
    document.getElementById("noFlightMessageGo").innerHTML = "查無航班";
  }
}

// ---- 渲染每一筆航班 ----
// directionKey: 'outbound' | 'inbound' | 'oneway'
function renderFlightList(flights, containerId, directionKey) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!flights || !flights.length) {
    container.innerHTML = `<p class="text-danger">沒有 ${directionKey} 航班</p>`;
    return;
  }

  flights.forEach((flight, index) => {
    const isSelected = isThisSelected(directionKey, flight);

    const card = `
      <div class="flight-card ${isSelected ? "selected" : ""}">
        <h5>${flight.flight_no} (${flight.class_type})</h5>
        <p>${flight.from_airport_name} ➜ ${flight.to_airport_name}</p>
        <p>出發: ${formatDateTime(flight.departure_time)}</p>
        <p>抵達: ${formatDateTime(flight.arrival_time)}</p>
        <p>價格: $${flight.price}</p>
        <p>座位剩餘: ${flight.seats_available}</p>
        <button data-direction="${directionKey}" data-index="${index}" class="btn-select">
          ${isSelected ? "已選擇" : "選擇"}
        </button>
      </div>
    `;
    container.innerHTML += card;
  });

  // 綁定每個 card 的選擇按鈕
  container.querySelectorAll(".btn-select").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const direction = e.currentTarget.dataset.direction;
      const idx = Number(e.currentTarget.dataset.index);
      const flight = flights[idx];

      selectFlight(direction, flight);
      // 重新渲染，讓選中的樣式更新
      renderFlights(currentData);
      updateCartPreview(); // 順便更新右下角的已選航班摘要
    });
  });
}

// 判斷該航班是否已被選
function isThisSelected(directionKey, flight) {
  const picked = selected[directionKey];
  if (!picked) return false;
  return picked.id == flight.id && picked.class_type == flight.class_type;
}

// ---- 選擇航班後的處理 ----
function selectFlight(direction, flight) {
  selected[direction] = {
    id: flight.id,
    flight_no: flight.flight_no,
    class_type: flight.class_type,
    price: flight.price,
    from_airport_name: flight.from_airport_name,
    to_airport_name: flight.to_airport_name,
    departure_time: flight.departure_time,
    arrival_time: flight.arrival_time,
  };
  toggleNextButton();
}

// ---- 顯示購物車資訊 ----
function bindCartButton() {
  const cartIcon = document.getElementById("cartIcon");
  cartIcon.addEventListener("click", () => {
    updateCartPreview(true); // 點擊時顯示
  });
}

// 更新（或顯示）購物車內的資訊
function updateCartPreview(forceShow = false) {
  const infoBox = document.querySelector(".SelectedFlightsInfo");
  const priceBox = document.querySelector(".SelectedPrices");

  const isRoundTrip = !!(currentData?.outbound && currentData?.inbound);

  let total = 0;
  const lines = [];

  if (isRoundTrip) {
    if (selected.outbound) {
      total += selected.outbound.price;
      lines.push(
        `[去程] ${selected.outbound.flight_no} (${selected.outbound.class_type}) $${selected.outbound.price}`
      );
    }
    if (selected.inbound) {
      total += selected.inbound.price;
      lines.push(
        `[回程] ${selected.inbound.flight_no} (${selected.inbound.class_type}) $${selected.inbound.price}`
      );
    }
  } else {
    if (selected.oneway) {
      total += selected.oneway.price;
      lines.push(
        `[單程] ${selected.oneway.flight_no} (${selected.oneway.class_type}) $${selected.oneway.price}`
      );
    }
  }

  const count = passengerCount || 1;
  const totalForAll = total * count;

  infoBox.innerHTML = lines.length ? lines.join("<br>") : "尚未選擇航班";
  priceBox.innerHTML = lines.length
    ? `人數：${count} 人<br>小計：$${total} x ${count} = <strong>$${totalForAll}</strong>`
    : "";

  if (forceShow) {
    infoBox.style.display = "block";
    priceBox.style.display = "block";
  }
}

// ---- 控制下一步按鈕是否可點 ----
function bindNextButton() {
  const nextBtn = document.getElementById("NextButton");
  nextBtn.addEventListener("click", async () => {
    await saveSelectionToSession();
  });
  toggleNextButton();
}

function toggleNextButton() {
  const nextBtn = document.getElementById("NextButton");
  const isRoundTrip = !!(currentData?.outbound && currentData?.inbound);

  let canGo = false;
  if (isRoundTrip) {
    canGo = !!(selected.outbound && selected.inbound);
  } else {
    canGo = !!selected.oneway;
  }
  nextBtn.disabled = !canGo;
}

// ---- 把選擇送到 PHP Session ----
async function saveSelectionToSession() {
  const isRoundTrip = !!(currentData?.outbound && currentData?.inbound);

  let total = 0;
  if (isRoundTrip) {
    total += selected.outbound?.price || 0;
    total += selected.inbound?.price || 0;
  } else {
    total += selected.oneway?.price || 0;
  }
  const totalForAll = total * (passengerCount || 1);

  const payload = {
    tripType: isRoundTrip ? "round" : "oneway",
    passengerCount: passengerCount,
    selectedFlights: {
      outbound: selected.outbound,
      inbound: selected.inbound,
      oneway: selected.oneway,
    },
    totalPrice: totalForAll,
  };

  try {
    const res = await fetch("../api/flights/save_selection.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.status === "success") {
      // 進入下一步（填寫旅客資料）
      window.location.href = "test.html"; // 你自己的下一步頁面
    } else {
      alert("儲存選擇失敗：" + (data.message || ""));
    }
  } catch (err) {
    console.error(err);
    alert("儲存選擇失敗，請稍後再試");
  }
}

// ---- 公用：格式化時間 ----
function formatDateTime(datetimeStr) {
  const dt = new Date(datetimeStr);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dt.getDate()).padStart(2, "0")} ${String(dt.getHours()).padStart(
    2,
    "0"
  )}:${String(dt.getMinutes()).padStart(2, "0")}`;
}
