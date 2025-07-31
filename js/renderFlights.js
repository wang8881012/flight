document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("accordionExample");
  if (!container) return;

  try {
    const res = await fetch("../api/flights/get_selection.php");
    const result = await res.json();
    const data = result.data; // 解開正確資料層級

    const passengerCount = data.passengerCount || 1;

    if (data.tripType === "oneway" && data.oneway) {
      container.prepend(createTimeCard(data.oneway, "oneway", passengerCount));
    } else if (data.tripType === "round" && data.outbound && data.inbound) {
      container.prepend(createTimeCard(data.inbound, "inbound", passengerCount));
      container.prepend(createTimeCard(data.outbound, "outbound", passengerCount));
    }
  } catch (err) {
    console.error("錯誤：", err);
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

  // 計算飛行時間
  const durationMs = new Date(flight.arrival_time) - new Date(flight.departure_time);
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationText = `${hours}h ${minutes}m`;

  // 艙等轉換
  const classMap = {
    economy: "經濟艙",
    business: "商務艙"
  };
  const className = classMap[flight.class_type] || "--";

  const card = document.createElement("div");
  card.className = "col-12 col-lg-10";

  card.innerHTML = `
    <div class="card m-3 border-0">

      <!-- Header -->
      <div class="row card-header mx-0 p-4 pt-3 rounded-top-5">
        <div class="d-flex flex-row align-items-center">
          <div class="gold-text fs-6">${fromName} → ${toName}</div>
          <div class="gold-text ms-3 fs-6">${fullDateTime}</div>
          <div class="gold-text ms-3 fs-6">${label}</div>
        </div>
      </div>

      <!-- Body -->
      <div class="row card-body mx-0 p-3 gy-3 rounded-bottom-5">

        <!-- 左側：出發與到達時間 -->
        <div class="col-12 col-lg-6 d-flex justify-content-around align-items-center flex-column flex-lg-row">
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

        <!-- 中間：飛行資訊 -->
        <div class="col-12 col-lg-3 d-flex flex-column justify-content-center text-start">
          <div class="blue-text fs-5 fw-bolder">
            <i class="bi bi-clock-history"></i> ${durationText}
          </div>
          <div class="blue-text fs-5 fw-bolder">
            <i class="bi bi-airplane-engines-fill"></i> ${flight.flight_no}
          </div>
          <div class="blue-text fs-5 fw-bolder">
            <i class="bi bi-ticket-perforated-fill"></i> ${passengerCount} 張
          </div>
        </div>

        <!-- 右側：艙等與展開按鈕 -->
        <div class="col-12 col-lg-3 d-flex flex-column justify-content-center align-items-center text-center">
          <div class="blue-text fs-4 fw-bolder">${className}</div>
          <button class="py-0 btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${label}">
            <i class="bi bi-caret-down-fill fs-1" data-toggle-icon="collapse-${label}"></i>
          </button>
        </div>

        <!-- 下拉詳細資訊 collapse -->
        <div class="collapse mt-4" id="collapse-${label}" data-bs-parent="#accordionExample">
          <div class="container my-4 detailed">
            <div class="row p-4 rounded">

              <!-- 左：行程詳細資訊 -->
              <div class="col-12 col-lg-6">
                <h4 class="blue-text fs-3 fw-bolder">行程詳細資訊</h4>
                <div class="d-flex flex-column flex-lg-row justify-content-around align-items-center">
                  <div class="ms-4 mb-4 mb-lg-0">
                    <div class="detailed-text">${durationText}</div>
                    <div class="detailed-text">航班班號 ${flight.flight_no}</div>
                  </div>
                  <div class="timeline d-flex flex-column position-relative">
                    <div class="mb-4 position-relative">
                      <div class="position-absolute top-0 start-0 translate-middle rounded-circle"></div>
                      <div class="ms-4 text-airport">
                        <strong>${fromName}</strong><br>
                        ${depTime}<br>
                        <!-- 航廈資訊缺資料 -->
                      </div>
                    </div>
                    <div class="mb-4 position-relative">
                      <div class="position-absolute top-0 start-0 translate-middle rounded-circle"></div>
                      <div class="ms-4 text-airport">
                        <strong>${toName}</strong><br>
                        ${arrTime}<br>
                        <!-- 航廈資訊缺資料 -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 中間：垂直線 -->
              <div class="col-12 col-lg-2 d-flex justify-content-center my-4 my-lg-0">
                <div class="middle-line"></div>
              </div>

              <!-- 右：艙等與加購 -->
              <div class="col-12 col-lg-4 d-flex flex-column justify-content-center align-items-center mt-4 mt-lg-0">
                <div class="mb-4 detailed-text"><strong>${className}</strong></div>
                <div class="mb-4 detailed-text">無任何加購</div> <!-- 加購資訊尚未串接 -->
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  return card;
}
