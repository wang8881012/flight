document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("accordionExample");
    console.log("📦 container：", container);
    if (!container) return;

    try {
        const res = await fetch("../api/flights/get_selection.php");
        const result = await res.json();
        const data = result.data; // ✅ 重點：解開 data.data 結構
        console.log("✅ 回傳資料", data);

        const passengerCount = data.passengerCount || 1;

        if (data.tripType === "oneway" && data.oneway) {
            const card = createTimeCard(data.oneway, "oneway", passengerCount);
            container.prepend(card);
        } else if (data.tripType === "round" && data.outbound && data.inbound) {
            const outboundCard = createTimeCard(data.outbound, "outbound", passengerCount);
            const inboundCard = createTimeCard(data.inbound, "inbound", passengerCount);
            container.prepend(inboundCard);
            container.prepend(outboundCard);
        }
    } catch (err) {
        console.error("❌ 錯誤：", err);
    }
});

function createTimeCard(flight, label, passengerCount) {
    const depTime = flight.departure_time?.split(" ")[1]?.slice(0, 5) || "--:--";
    const arrTime = flight.arrival_time?.split(" ")[1]?.slice(0, 5) || "--:--";
    const fullDateTime = flight.departure_time || "未知時間";

    const from = flight.from_airport;
    const to = flight.to_airport;
    const fromName = flight.from_airport_name || from;
    const toName = flight.to_airport_name || to;

    const card = document.createElement("div");
    card.className = "col-12 col-lg-10";

    card.innerHTML = `
    <div class="card m-3 border-0">

      <!-- ✅ 卡片 header -->
      <div class="row card-header mx-0 p-4 pt-3 rounded-top-5">
        <div class="d-flex flex-row align-items-center">
          <div class="gold-text fs-6">${fromName} → ${toName}</div>
          <div class="gold-text ms-3 fs-6">${fullDateTime}</div>
          <div class="gold-text ms-3 fs-6">${label}</div>
        </div>
      </div>

      <!-- ✅ 卡片 body（時間區塊） -->
      <div class="row card-body mx-0 p-3 gy-3 rounded-bottom-5">
        <div class="col-12 col-lg-7 d-flex justify-content-around align-items-center flex-column flex-lg-row">
          <div class="text-center me-lg-4 mb-3 mb-lg-0" id="${label}-departure">
            <p class="blue-text fs-3 fw-bolder">${depTime}</p>
            <p class="blue-text fs-3 fw-bolder">${from}</p>
          </div>
          <div class="blue-text fs-3 fw-bolder">→</div>
          <div class="text-center" id="${label}-arrival">
            <h4 class="blue-text fs-3 fw-bolder">${arrTime}</h4>
            <p class="blue-text fs-3 fw-bolder">${to}</p>
          </div>
        </div>
      </div>
    </div>
  `;

    return card;
}

