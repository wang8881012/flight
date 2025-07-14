// 動態渲染旅客資料

window.addEventListener('DOMContentLoaded', () => {
  const passengers = JSON.parse(localStorage.getItem("passengers")) || [];
  const container = document.getElementById("passenger-container");

  passengers.forEach((person, index) => {
    const section = document.createElement("div");
    section.className = "section-container mb-4";
    section.innerHTML = `
      <h5 class="text-center fw-bold mb-4 blue-text fs-3">同行${index + 1}</h5>
      <div class="row">
          <div class="col-md-6 info-group">
              <label class="form-label blue-text fs-5 fw-bold">英文姓名</label>
              <input type="text" class="form-control blue-text fs-5 fw-bold mb-2" value="${person.name}">
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">性別</label>
            <select class="form-select blue-text fs-5 fw-bold mb-2">
              <option ${person.gender === '男性' ? 'selected' : ''} class="blue-text fs-5 fw-bold">男性</option>
              <option ${person.gender === '女性' ? 'selected' : ''} class="blue-text fs-5 fw-bold">女性</option>
              <option ${person.gender === '其他' ? 'selected' : ''} class="blue-text fs-5 fw-bold">其他</option>
            </select>
          </div>

          <div class="col-md-6 info-group">
              <label class="form-label blue-text fs-5 fw-bold">身分證</label>
              <input type="text" class="form-control blue-text fs-5 fw-bold mb-2" value="${person.id}">
          </div>

          <div class="col-md-6 info-group">
            <label class="form-label blue-text fs-5 fw-bold">發行國家／地區</label>
            <select class="form-select blue-text fs-5 fw-bold mb-2">
              <option ${person.nationality === '中華民國(台灣)' ? 'selected' : ''}  class="blue-text fs-5 fw-bold">中華民國(台灣)</option>
              <option ${person.nationality === '日本' ? 'selected' : ''} class="blue-text fs-5 fw-bold">日本</option>
              <option ${person.nationality === '韓國' ? 'selected' : ''} class="blue-text fs-5 fw-bold">韓國</option>
              <option ${person.nationality === '美國' ? 'selected' : ''} class="blue-text fs-5 fw-bold">美國</option>
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
              <option ${person.issueCountry === '中華民國(台灣)' ? 'selected' : ''} class="blue-text fs-5 fw-bold">中華民國(台灣)</option>
              <option ${person.issueCountry === '日本' ? 'selected' : ''} class="blue-text fs-5 fw-bold">日本</option>
              <option ${person.issueCountry === '韓國' ? 'selected' : ''} class="blue-text fs-5 fw-bold">韓國</option>
              <option ${person.issueCountry === '美國' ? 'selected' : ''} class="blue-text fs-5 fw-bold">美國</option>
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
});
