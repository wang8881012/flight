// POST 旅客資料到 submit_passengers.php，並在成功後跳轉頁面
document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("NextButton");

  nextButton.addEventListener("click", async (e) => {
    e.preventDefault();

    // 1. 收集會員資料
    const memberData = {
      passport_last_name: document.getElementById("lastName").value,
      passport_first_name: document.getElementById("firstName").value,
      email: document.getElementById("email").value,
      birthday: document.getElementById("birthday").value,
      phone: document.getElementById("phone").value,
      gender: document.getElementById("genderInput").value,
      passport_number: document.getElementById("pwNumber").value,
      passport_expiry: document.getElementById("ex_date").value,
      nationality: document.getElementById("pwNation").value
    };

    // 2. 收集同行旅客資料
    const passengerCards = document.querySelectorAll(".passenger-card");
    const passengers = [];

    passengerCards.forEach(card => {
      const passenger = {
        passport_last_name: card.querySelector("[data-field='last_name']").value,
        passport_first_name: card.querySelector("[data-field='first_name']").value,
        birthday: card.querySelector("[data-field='birthday']").value,
        gender: card.querySelector("[data-field='gender']").value,
        passport_number: card.querySelector("[data-field='passport_number']").value,
        nationality: card.querySelector("[data-field='nationality']").value,
        passport_expiry: card.querySelector("[data-field='passport_expiry']").value
      };
      passengers.push(passenger);
    });

    // 3. 組合總資料
    const payload = {
      member: memberData,
      passengers: passengers
    };

    try {
      const res = await fetch("../api/booking/submit_passengers.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        console.log("後端回傳：", result);

        // 你可以根據後端回傳決定跳轉
        window.location.href = "../public/booking_seat.html";
      } else {
        console.error("送出失敗：", res.status);
        alert("提交失敗，請稍後再試！");
      }
    } catch (err) {
      console.error("發生錯誤：", err);
      alert("發生錯誤，請確認網路或稍後再試。");
    }
  });
});
