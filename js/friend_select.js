document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../api/booking/form_count.php");
    const data = await response.json();

    const member = data.member;
    const friends = data.friends;

    // 處理所有同行旅客卡片
    document.querySelectorAll(".passenger-card").forEach((card, index) => {
      const i = index + 2; // 第 2 位開始是同行旅客
      const dropdown = card.querySelector(".friendDropdown");
      const list = dropdown.querySelector(".dropdown-menu");

      // 顯示下拉選單區塊
      dropdown.style.display = "block";

      // 建立好友選單項目
      friends.forEach(friend => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.className = "dropdown-item";
        a.href = "#";
        a.textContent = friend.name;
        a.dataset.friend = JSON.stringify(friend);
        li.appendChild(a);
        list.appendChild(li);
      });

      // 處理「選擇好友」點擊事件
      list.querySelectorAll("a").forEach(item => {
        item.addEventListener("click", e => {
          e.preventDefault();
          const friendData = JSON.parse(item.dataset.friend);
          fillPassengerForm(card, friendData);
        });
      });

      // 處理「使用會員資料」checkbox
      const copySelfCheckbox = card.querySelector(".copySelf");
      if (copySelfCheckbox) {
        copySelfCheckbox.addEventListener("change", e => {
          if (e.target.checked) {
            fillPassengerForm(card, member);
          } else {
            clearPassengerForm(card);
          }
        });
      }
    });

    // 代入表單欄位
    function fillPassengerForm(card, data) {
      card.querySelector("[data-field='last_name']").value = data.passport_last_name || "";
      card.querySelector("[data-field='first_name']").value = data.passport_first_name || "";
      card.querySelector("[data-field='birthday']").value = data.birthday || "";

      // 性別：設下拉按鈕與 hidden input
      const gender = data.gender || "";
      const genderBtn = card.querySelector(".genderBtn");
      const genderInput = card.querySelector("[data-field='gender']");
      if (genderBtn && genderInput) {
        genderBtn.textContent = gender;
        genderInput.value = gender;
      }

      card.querySelector("[data-field='passport_number']").value = data.passport_number || "";
      card.querySelector("[data-field='nationality']").value = data.nationality || "";
      card.querySelector("[data-field='passport_expiry']").value = data.passport_expiry || "";
    }

    // 清空欄位
    function clearPassengerForm(card) {
      card.querySelectorAll("input[data-field]").forEach(input => {
        input.value = "";
      });
      const genderBtn = card.querySelector(".genderBtn");
      if (genderBtn) genderBtn.textContent = "請選擇性別";
    }

  } catch (err) {
    console.error("無法載入好友資料：", err);
  }
});
