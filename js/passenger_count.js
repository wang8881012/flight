document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../api/booking/form_count.php");
    const data = await response.json();
    console.log(data)
    // 1. 填入會員資料
    const member = data.user_data;
    //console.log(member)

    document.getElementById("lastName").value = member.passport_last_name;
    document.getElementById("firstName").value = member.passport_first_name;
    document.getElementById("email").value = member.email;
    document.getElementById("birthday").value = member.birthday;
    document.getElementById("phone").value = member.phone;
    document.getElementById("genderInput").value = member.gender;
    document.getElementById("genderDropdown").innerText = member.gender;
    document.getElementById("pwNumber").value = member.passport_number;
    document.getElementById("ex_date").value = member.passport_expiry;
    document.getElementById("pwNation").value = member.nationality;

    // 2. 動態產生旅客表單
    const passengerCount = data.passenger_count || 1;
    const container = document.getElementById("extraPassengers");
    const template = document.getElementById("passenger-template").innerHTML;

    for (let i = 1; i < passengerCount; i++) {
      let html = template.replace(/{{i}}/g, i + 1); // 從 2 開始
      container.insertAdjacentHTML("beforeend", html);
    }

    // 3. 性別下拉選項事件（對每位乘客）
    document.querySelectorAll(".genderSelect .dropdown-menu a").forEach(item => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const gender = this.getAttribute("data-value");
        const dropdown = this.closest(".genderSelect");
        dropdown.querySelector(".genderBtn").textContent = gender;
        dropdown.querySelector("input[data-field='gender']").value = gender;
      });
    });

  } catch (err) {
    console.error("資料載入失敗：", err);
  }
});
