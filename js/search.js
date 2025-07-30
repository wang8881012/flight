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

// 翻成中文
  function translateClassType(type) {
  switch (type) {
    case "economy":
      return "經濟艙";
    case "business":
      return "商務艙";
    default:
      return type;
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

  

  // 把同 flight_no 的艙等 class 分組在同一個 card 裡面
  const groupedFlights = {};

  flights.forEach((f) => {
    if (!groupedFlights[f.flight_no]) groupedFlights[f.flight_no] = [];
    groupedFlights[f.flight_no].push(f);
  });

  Object.entries(groupedFlights).forEach(([flight_no, classOptions]) => {
    const base = classOptions[0]; // 拿第一個作為時間、機場資訊顯示

    function formatDuration(minutes) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs} 小時 ${mins} 分鐘`;
    }

    const durationText = formatDuration(parseInt(base.duration));

    const classButtons = classOptions
      .map((flight, idx) => {
        const isSelected = isThisSelected(directionKey, flight);
        return `
          <div class="class-option ${isSelected ? "selected" : ""}">
            <div class="class-type">${translateClassType(flight.class_type)}</div>
            <div class="class-price">NT$${flight.price.toLocaleString()}</div>
            <button 
              class="btn-select" 
              data-direction="${directionKey}" 
              data-flight-no="${flight_no}" 
              data-class-type="${flight.class_type}"
              data-idx="${flights.indexOf(flight)}"
            >
              ${isSelected ? "已選擇" : "選擇"}
            </button>
          </div>
        `;
      })
      .join("");

    const cardHTML = `
      <div class="flight-card flight-card-full">
        <div class="flight-info-left">
        <div class="date">${base.departure_time.slice(0, 10)}</div>
          <div class="time-row">
            <div class="depart-time">${base.departure_time.slice(11, 16)}</div>
            <div class="duration">${durationText}</div>
            <div class="arrive-time">${base.arrival_time.slice(11, 16)}</div>
          </div>
          <div class="airport-row">
            <div>${base.from_airport}</div>
            <div class="arrow">→</div>
            <div>${base.to_airport}</div>
          </div>
          <div class="airport-name-row">
            <div>${base.from_airport_name}</div>
            <div></div>
            <div>${base.to_airport_name}</div>
          </div>
        </div>
        <div class="flight-info-right">
          ${classButtons}
        </div>
      </div>
    `;

    container.innerHTML += cardHTML;
  });

  // 綁定選擇按鈕
  container.querySelectorAll(".btn-select").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.idx);
      const direction = e.currentTarget.dataset.direction;
      const flight = flights[idx];

      selectFlight(direction, flight);
      renderFlights(currentData);
      updateCartPreview();
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
    duration: flight.duration,
  };
  toggleNextButton();
}

// ---- 顯示購物車資訊 ----
function bindCartButton() {
  const cartIcon = document.getElementById("cartIcon");
  const infoBox = document.querySelector(".SelectedFlightsInfo");
  const priceBox = document.querySelector(".SelectedPrices");

  cartIcon.addEventListener("click", () => {
    const isVisible = infoBox.style.display === "block";

    if (isVisible) {
      // 隱藏
      infoBox.style.display = "none";
      priceBox.style.display = "none";
    } else {
      // 顯示 + 更新內容
      updateCartPreview(true);
    }
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
        `[去程] ${selected.outbound.flight_no} (${translateClassType(selected.outbound.class_type)}) $${selected.outbound.price}`
      );
    }
    if (selected.inbound) {
      total += selected.inbound.price;
      lines.push(
        `[回程] ${selected.inbound.flight_no} (${translateClassType(selected.inbound.class_type)}) $${selected.inbound.price}`
      );
    }
  } else {
    if (selected.oneway) {
      total += selected.oneway.price;
      lines.push(
        `[單程] ${selected.oneway.flight_no} (${translateClassType(selected.oneway.class_type)}) $${selected.oneway.price}`
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
      // 檢查登入狀態
      const loginRes = await fetch("../api/auth/check_login.php", { credentials: "include" });
      const loginData = await loginRes.json();
      if (loginData.loggedIn) {
        window.location.href = "booking_user.html";
      } else {
        // 設定登入後導向
        await fetch("../api/auth/set_login_redirect.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ redirect: "../../public/booking_user.html" })
        });
        window.location.href = "login.html";
      }
    } else {
      alert("儲存選擇失敗：" + (data.message || ""));
    }
  } catch (err) {
    console.error(err);
    alert("儲存選擇失敗，請稍後再試");
  }
}