document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("accordionExample");
    if (!container) {
        console.error("❌ 找不到 #accordionExample 容器");
        return;
    }

    try {
        // ✅ 改這裡：你實際用的後端路徑
        const res = await fetch("../api/flights/get_selection.php");
        const data = await res.json();
        console.log("✅ 回傳資料：", data);

        if (!data || !data.tripType) {
            container.innerHTML = `<div class="text-danger">回傳資料格式錯誤</div>`;
            return;
        }

        const passengerCount = data.passengerCount || 1;

        // 單程
        if (data.tripType === "oneway" && data.oneway) {
            const card = createFlightCard(data.oneway, "單程", passengerCount);
            container.prepend(card);
        }

        // 來回
        if (data.tripType === "round" && data.outbound && data.return) {
            const outboundCard = createFlightCard(data.outbound, "去程", passengerCount);
            const returnCard = createFlightCard(data.return, "回程", passengerCount);
            container.prepend(returnCard);
            container.prepend(outboundCard);
        }

    } catch (err) {
        console.error("❌ JS 發生錯誤：", err);
        container.innerHTML = `<div class="text-danger">資料讀取失敗</div>`;
    }
});

// ✅ 渲染卡片
function createFlightCard(flight, labelText, passengerCount) {
    const departureTime = flight.departure_time?.split(" ")[1]?.slice(0, 5) || "--:--";
    const arrivalTime = flight.arrival_time?.split(" ")[1]?.slice(0, 5) || "--:--";
    const date = flight.departure_time?.split(" ")[0] || "未知日期";
    const className = flight.class_type === "business" ? "商務艙" : "經濟艙";
    const from = flight.from_airport;
    const to = flight.to_airport;

    const card = document.createElement("div");
    card.className = "col-12 col-lg-10";

    card.innerHTML = `
    <div class="card m-3 border-0">
      <div class="row card-header mx-0 p-4 pt-3 rounded-top-5">
        <div class="d-flex flex-row align-items-center">
          <div class="gold-text fs-6">${flight.from_airport_name} → ${flight.to_airport_name}</div>
          <div class="gold-text ms-3 fs-6">${date}</div>
          <div class="gold-text ms-3 fs-6">${labelText}</div>
        </div>
      </div>

      <div class="row card-body mx-0 p-3 gy-3 rounded-bottom-5">
        <div class="col-12 col-lg-7 d-flex justify-content-around align-items-center flex-column flex-lg-row">
          <div class="text-center me-lg-4 mb-3 mb-lg-0">
            <p class="blue-text fs-3 fw-bolder">${departureTime}</p>
            <p class="blue-text fs-3 fw-bolder">${from}</p>
          </div>
          <div class="blue-text fs-3 fw-bolder">→</div>
          <div class="text-center">
            <h4 class="blue-text fs-3 fw-bolder">${arrivalTime}</h4>
            <p class="blue-text fs-3 fw-bolder">${to}</p>
          </div>
        </div>

        <div class="col-12 col-lg-2 d-flex flex-column justify-content-center text-start">
          <div class="blue-text fs-4 fw-bolder"><i class="bi bi-clock-history"></i> （暫不顯示）</div>
          <div class="blue-text fs-4 fw-bolder"><i class="bi bi-airplane-engines-fill"></i> ${flight.flight_no}</div>
          <div class="blue-text fs-4 fw-bolder"><i class="bi bi-ticket-perforated-fill"></i> ${passengerCount} 張</div>
        </div>

        <div class="col-12 col-lg-3 d-flex flex-column justify-content-center align-items-center text-center">
          <div class="blue-text fs-4 fw-bolder">${className}</div>
        </div>
      </div>
    </div>
  `;

    return card;
}