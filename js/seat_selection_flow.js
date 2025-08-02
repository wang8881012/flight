// 將資料post出去
let passengerCount = 1;
let currentPassengerIndex = 1;
const allSelections = [];

// 從後端取得 class_type 與 bookedSeats 並分別指定去程與回程
function setClassTypesFromServer(data) {
  if (!window.setClassTypes || !window.setBookedSeats) return;

  const outboundClass = data?.outbound?.class_type || "economy";
  const returnClass = data?.inbound?.class_type || "economy";
  const outboundBooked = data?.outbound?.bookedSeats || [];
  const returnBooked = data?.inbound?.bookedSeats || [];

  window.setClassTypes({
    outbound: outboundClass,
    return: returnClass,
  });

  window.setBookedSeats({
    outbound: outboundBooked,
    return: returnBooked,
  });

  // 設定完成後立即更新畫面
  updateAllCanvas();
}

// 實作 setClassTypes：寫入到 flightData.classType
window.setClassTypes = function (types) {
  if (!window.flightData) return;
  if (types.outbound && window.flightData.outbound) {
    window.flightData.outbound.classType = types.outbound;
  }
  if (types.return && window.flightData.return) {
    window.flightData.return.classType = types.return;
  }
};

// 實作 setBookedSeats：儲存後端標記為已預訂的座位
window.setBookedSeats = function (map) {
  if (!window.flightData) return;
  if (map.outbound && window.flightData.outbound) {
    window.flightData.outbound.bookedSeats = map.outbound;
  }
  if (map.return && window.flightData.return) {
    window.flightData.return.bookedSeats = map.return;
  }
};

// 等 DOM 與其他 JS 載入完
document.addEventListener("DOMContentLoaded", () => {
  fetch("../api/flights/get_selection.php") //這邊改成get_selection.php
    .then((res) => res.json())
    .then((data) => {
      realData = data.data;
      passengerCount = parseInt(realData.passengerCount) || 1;
      //console.log('從後端取得 passengerCount =', passengerCount);

      setClassTypesFromServer(realData);
    });

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const outboundSeat = window.getSelectedSeat("outbound");
      const returnSeat = window.getSelectedSeat("return");
      const outboundMeal = document.getElementById("mealInput")?.value || "";
      const returnMeal =
        document.getElementById("return_mealInput")?.value || "";
      const outboundBaggageWeight =
        document.getElementById("checked_baggageWeight")?.value || "";
      const outboundBaggagePrice =
        document.getElementById("checked_baggagePrice")?.value || "";
      const returnBaggageWeight =
        document.getElementById("return_checked_baggageWeight")?.value || "";
      const returnBaggagePrice =
        document.getElementById("return_checked_baggagePrice")?.value || "";

      //選購完按 next 測試是否有資料
      // console.log(outboundSeat)
      // console.log(returnSeat)
      // console.log(outboundMeal)
      // console.log(returnMeal)
      // console.log(outboundBaggageWeight)
      // console.log(outboundBaggagePrice)
      // console.log(returnBaggageWeight)
      // console.log(returnBaggagePrice)

      if (!outboundSeat || !returnSeat) {
        alert("請完成去程與回程座位選擇！");
        return;
      }

      allSelections.push({
        passenger: currentPassengerIndex,
        outbound: {
          seat: outboundSeat,
          meal: outboundMeal,
          baggage: {
            weight: outboundBaggageWeight,
            price: outboundBaggagePrice,
          },
        },
        return: {
          seat: returnSeat,
          meal: returnMeal,
          baggage: { weight: returnBaggageWeight, price: returnBaggagePrice },
        },
      });

      // 測試是否有帶入資料
      //console.log(JSON.stringify(allSelections, null, 2));

      currentPassengerIndex++;

      if (currentPassengerIndex > passengerCount) {
        console.log("所有乘客選擇完成：", allSelections);

        fetch("../api/booking/save_seat_selection.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selections: allSelections }),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              alert("所有乘客選位成功，將跳轉至下一頁");
              window.location.href = "confirm.html";
            } else {
              alert(result.message || "送出失敗");
            }
          })
          .catch((err) => {
            console.error("送出錯誤", err);
            alert("傳送錯誤");
          });
      } else {
        window.resetSeatSelection?.("outbound");
        window.resetSeatSelection?.("return");
        updateAllCanvas();

        const outboundCollapse = document.getElementById("outboundCollapse");
        const bsCollapse =
          bootstrap.Collapse.getOrCreateInstance(outboundCollapse);
        bsCollapse.show();

        const outboundSection = document.getElementById("outbound-section");
        if (outboundSection) {
          outboundSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }
});

function updateAllCanvas() {
  const tripTypes = ["outbound", "return"];
  for (const trip of tripTypes) {
    const canvas = document.getElementById(`${trip}Canvas`);
    const ctx = canvas?.getContext("2d");
    if (ctx && window.drawCanvasWithOverlay) {
      window.drawCanvasWithOverlay(
        trip,
        ctx,
        canvas.width,
        canvas.height,
        currentPassengerIndex
      );
    }
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 平滑滾動
  });
}
