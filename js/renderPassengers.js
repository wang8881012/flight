  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const res = await fetch("../api/confirm/get_passenger_info.php");
      const data = await res.json();
      //console.log(data)
      const mainUser = data?.main_user || {};
      const passengers = data?.passenger || [];

      fillMainUserForm(mainUser);        // 填入會員本人
      renderPassengers(passengers);      // 渲染同行旅客
    } catch (err) {
      console.error("無法取得乘客資料", err);
    }
  });

  // 抓取會員本人表單id，依照回傳資料自動填充value
  function fillMainUserForm(user) {
    document.getElementById("passport-last-name").value = user.passport_last_name || "";
    document.getElementById("passport-first-name").value = user.passport_first_name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("birth").value = user.birthday || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("passport-number").value = user.passport_number || "";
    document.getElementById("passport-expiry").value = user.passport_expiry || "";
    document.getElementById("nationality").value = user.nationality || "";

    const genderSelect = document.getElementById("gender");
    if (genderSelect) {
      genderSelect.value = user.gender || "男性";
    }
  }

  // 自動渲染同行旅客功能
  function renderPassengers(passengers) {
    const container = document.getElementById("passenger-container");
    if (!container) return;

    passengers.forEach((p, index) => {
      const person = {
        name: `${p.passport_last_name || ''} ${p.passport_first_name || ''}`,
        gender: p.gender || '',
        id: '', // 未提供身分證
        issueCountry: '', // 未提供發行國家
        passport: p.passport_number || '',
        expire: p.passport_expiry || '',
        nationality: p.nationality || '',
        birth: p.birthday || ''
      };

      const section = document.createElement("div");
      section.innerHTML = `
        <h5 class="text-center fw-bold mb-4 blue-text fs-3">同行旅客 ${index + 1}</h5>
        <div class="row">
          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">英文姓名</label>
            <input type="text" class="form-control blue-text fs-5 fw-bold mb-2" value="${person.name}">
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">性別</label>
            <select class="form-select blue-text fs-5 fw-bold mb-2">
              <option ${person.gender === '男性' ? 'selected' : ''}>男性</option>
              <option ${person.gender === '女性' ? 'selected' : ''}>女性</option>
              <option ${person.gender === '其他' ? 'selected' : ''}>其他</option>
            </select>
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">發行國家／地區</label>
            <select class="form-select blue-text fs-5 fw-bold mb-2">
              <option ${person.issueCountry === '中華民國(台灣)' ? 'selected' : ''}>中華民國(台灣)</option>
              <option ${person.issueCountry === '日本' ? 'selected' : ''}>日本</option>
              <option ${person.issueCountry === '韓國' ? 'selected' : ''}>韓國</option>
              <option ${person.issueCountry === '美國' ? 'selected' : ''}>美國</option>
            </select>
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">護照號碼</label>
            <input type="text" class="form-control blue-text fs-5 fw-bold mb-2" value="${person.passport}">
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">有效期限</label>
            <input type="text" class="form-control blue-text fs-5 fw-bold mb-2" value="${person.expire}">
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">國籍／地區</label>
            <select class="form-select blue-text fs-5 fw-bold mb-2">
              <option ${person.nationality === '中華民國(台灣)' ? 'selected' : ''}>中華民國(台灣)</option>
              <option ${person.nationality === '日本' ? 'selected' : ''}>日本</option>
              <option ${person.nationality === '韓國' ? 'selected' : ''}>韓國</option>
              <option ${person.nationality === '美國' ? 'selected' : ''}>美國</option>
            </select>
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">出生日期</label>
            <input type="text" class="form-control blue-text fs-5 fw-bold" value="${person.birth}">
          </div>
        </div>
        <hr class="border-5">
      `;

      container.appendChild(section);
    });
  }
