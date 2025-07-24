// ✅ 通用欄位驗證函式
function validateTextField(inputId, errorId, options = {}) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) {
    console.warn(`⚠️ 找不到 input 或 error 元素：${inputId}, ${errorId}`);
    return false;
  }
  const value = input.value.trim();
  error.style.display = 'none';
  error.textContent = '';

  if (value === '') {
    error.textContent = options.emptyMsg || '欄位不得為空！';
    error.style.display = 'block';
    return false;
  }
  if (options.regex && !options.regex.test(value)) {
    error.textContent = options.invalidMsg || '格式錯誤';
    error.style.display = 'block';
    return false;
  }
  if (options.maxDate === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(value);
    if (inputDate > today) {
      error.textContent = options.futureMsg || '有效日期不能晚於今天';
      error.style.display = 'block';
      return false;
    }
  }
  return true;
}
// ✅ 複製會員資料到旅客表單
function copyPrimaryTo(form) {
  const mapping = {
    'first_name': 'firstName',
    'last_name': 'lastName',
    'birthday': 'birthday',
    'gender': 'genderInput',
    'passport_number': 'pwNumber',
    'nationality': 'pwNation',
    'passport_expiry': 'ex_date'
  };
  for (const key in mapping) {
    const source = document.getElementById(mapping[key]);
    const target = form.querySelector(`[data-field="${key}"]`);
    if (source && target) {
      target.value = source.value;
      if (key === 'gender') {
        form.querySelector('.genderBtn').textContent = source.value;
      }
    }
  }
}

// ✅ 顯示欄位錯誤（用於動態旅客）
function hideError(form, field) {
  const error = form.querySelector(`[data-error="${field}"]`);
  if (error) error.style.display = 'none';
}

// ✅ 載入好友資料到旅客表單
function loadFriendData(friendId) {
  fetch(`/flight-2/api/booking/get_friend_by_id.php?id=${friendId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const lastCard = document.querySelector('.passenger-card:last-child');
        const form = lastCard.querySelector('.passenger-form');
        form.querySelector('[data-field="first_name"]').value = data.friend.passport_first_name;
        form.querySelector('[data-field="last_name"]').value = data.friend.passport_last_name;
        form.querySelector('[data-field="birthday"]').value = data.friend.birthday;
        form.querySelector('[data-field="gender"]').value = data.friend.gender;
        form.querySelector('.genderBtn').textContent = data.friend.gender;
        form.querySelector('[data-field="passport_number"]').value = data.friend.passport_number;
        form.querySelector('[data-field="nationality"]').value = data.friend.nationality;
        form.querySelector('[data-field="passport_expiry"]').value = data.friend.passport_expiry;
      } else {
        alert(data.error);
      }
    });
}

/// ✅ 從後端抓取好友並渲染到下拉選單
function renderFriendDropdown(form) {
  const dropdown = form.querySelector('.friendDropdown');
  const ul = dropdown.querySelector('.dropdown-menu');
  ul.innerHTML = '';

  fetch('/flight-2/api/booking/get_friends.php')
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;

      data.friends.forEach(friend => {
        const li = document.createElement('li');
        li.innerHTML = `
          <a class="dropdown-item" href="#" data-id="${friend.id}">
            ${friend.passport_last_name} ${friend.passport_first_name}
          </a>`;
        ul.appendChild(li);
      });

      // 綁定選擇事件
      ul.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          loadFriendData(this.dataset.id, form); // 把 form 傳進去
        });
      });
    });
}

// ✅ 載入好友資料到指定旅客表單
function loadFriendData(friendId, form) {
  fetch(`/flight-2/api/booking/get_friend_by_id.php?id=${friendId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        form.querySelector('[data-field="first_name"]').value = data.friend.passport_first_name;
        form.querySelector('[data-field="last_name"]').value = data.friend.passport_last_name;
        form.querySelector('[data-field="birthday"]').value = data.friend.birthday;
        form.querySelector('[data-field="gender"]').value = data.friend.gender;
        form.querySelector('.genderBtn').textContent = data.friend.gender;
        form.querySelector('[data-field="passport_number"]').value = data.friend.passport_number;
        form.querySelector('[data-field="nationality"]').value = data.friend.nationality;
        form.querySelector('[data-field="passport_expiry"]').value = data.friend.passport_expiry;
      } else {
        alert(data.error);
      }
    });
}

// ✅ 初始化動態旅客卡片的事件
function initPassengerCardEvents() {
  document.querySelectorAll('.passenger-card').forEach(card => {
    const form = card.querySelector('.passenger-form');

    // ✅ 性別選擇
    form.querySelectorAll('.genderSelect .dropdown-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const val = item.dataset.value;
        form.querySelector('[data-field="gender"]').value = val;
        form.querySelector('.genderBtn').textContent = val;
        hideError(form, 'gender');
      });
    });

    // ✅ 勾選「複製會員資料」功能
    const copySelfCheckbox = form.querySelector('.copySelf');
    if (copySelfCheckbox) {
      copySelfCheckbox.addEventListener('change', () => {
        if (copySelfCheckbox.checked) {
          copyPrimaryTo(form);
        }
      });
    }

    // ✅ 勾選「選擇好友資料」功能
    const copyFriendCheckbox = form.querySelector('.copyFriend');
    if (copyFriendCheckbox) {
      copyFriendCheckbox.addEventListener('change', () => {
        const dropdown = form.querySelector('.friendDropdown');
        dropdown.style.display = copyFriendCheckbox.checked ? 'block' : 'none';
        if (copyFriendCheckbox.checked) {
          renderFriendDropdown(form); // 將好友列表顯示在當前卡片內
        }
      });
    }
  });
}


// ✅ 渲染旅客卡片
function renderExtraPassengers(count) {
  const container = document.getElementById('extraPassengers');
  const tpl = document.getElementById('passenger-template').innerHTML;
  container.innerHTML = '';
  for (let i = 2; i <= count; i++) {
    const html = tpl.replaceAll('{{i}}', i);
    container.insertAdjacentHTML('beforeend', html);
  }
  initPassengerCardEvents();
}

// ✅ 主流程
document.addEventListener('DOMContentLoaded', () => {
    // ✅ 預設設定旅客人數為 2（會員 + 1 位旅伴）
  localStorage.setItem('passenger_count', '2');
  const genderDropdown = document.getElementById('genderDropdown');
  const genderInput = document.getElementById('genderInput');
  const genderMenu = document.querySelector('#genderDropdown + .dropdown-menu');
  const genderError = document.getElementById('gender_error');
  const next_btn = document.getElementById('next_btn');

  // 性別選單事件（會員）
  genderMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const gender = item.getAttribute('data-type');
      genderDropdown.textContent = gender;
      genderInput.value = gender;
      genderError.style.display = 'none';
      genderDropdown.classList.remove('border-error');
    });
  });

  // 取得會員資料
  fetch('/flight-2/api/booking/get_user_info.php')
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        const user = result.user;
        document.getElementById('firstName').value = user.passport_first_name || '';
        document.getElementById('lastName').value = user.passport_last_name || '';
        document.getElementById('birthday').value = user.birthday || '';
        document.getElementById('pwNation').value = user.nationality || '';
        document.getElementById('pwNumber').value = user.passport_number || '';
        document.getElementById('ex_date').value = user.passport_expiry || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        if (user.gender) {
          genderDropdown.textContent = user.gender;
          genderInput.value = user.gender;
        }
      } else {
        console.warn('無會員資料或尚未登入：', result.error);
      }
    });

  // ✅ 「同旅伴好友」勾選事件
  // document.getElementById('flexCheckDefault').addEventListener('change', function () {
  //   const dropdown = document.getElementById('friendDropdown');
  //   dropdown.style.display = this.checked ? 'block' : 'none';
  //   if (this.checked) {
  //     fetch('/flight-2/api/booking/get_friends.php')
  //       .then(res => res.json())
  //       .then(data => {
  //         const ul = dropdown.querySelector('.dropdown-menu');
  //         ul.innerHTML = '';
  //         data.friends.forEach(friend => {
  //           const li = document.createElement('li');
  //           li.innerHTML = `<a class="dropdown-item" href="#" data-id="${friend.id}">
  //             ${friend.passport_last_name} ${friend.passport_first_name}
  //           </a>`;
  //           ul.appendChild(li);
  //         });

  //         ul.querySelectorAll('.dropdown-item').forEach(item => {
  //           item.addEventListener('click', function (e) {
  //             e.preventDefault();
  //             loadFriendData(this.dataset.id);
  //           });
  //         });
  //       });
  //   }
  // });

  // ✅ 渲染同行旅客表單
  const passengerCount = Number(localStorage.getItem('passenger_count') || 3);
  renderExtraPassengers(passengerCount);

  // ✅ 送出按鈕處理：驗證 + 儲存
  next_btn.addEventListener('click', function (event) {
    event.preventDefault();
    let hasError = false;

    // 性別驗證
    if (genderInput.value === '') {
      genderDropdown.classList.add('border-error');
      hasError = true;
    } else {
      genderError.style.display = 'none';
      genderDropdown.classList.remove('border-error');
    }

    // 其他欄位驗證
    hasError |= !validateTextField('lastName', 'lastName_error', {
      regex: /^[a-zA-Z]+$/, emptyMsg: '請填寫英文姓', invalidMsg: '不得填寫數字或特殊符號！'
    });
    hasError |= !validateTextField('firstName', 'firstName_error', {
      regex: /^[a-zA-Z\-]+$/, emptyMsg: '請填寫英文名', invalidMsg: '不得填寫數字或特殊符號！'
    });

    hasError |= !validateTextField('birthday', 'birthday_error', {
      regex: /^\d{4}-\d{2}-\d{2}$/, emptyMsg: '請填寫出生日期', invalidMsg: '日期格式錯誤', maxDate: 'today', futureMsg: '出生日期不能是未來時間'
    });

    hasError |= !validateTextField('pwNumber', 'pwNumber_error', {
      regex: /^[0-9]{9}$/, emptyMsg: '請填寫護照號碼', invalidMsg: '護照格式錯誤 123456789'
    });
    hasError |= !validateTextField('pwNation', 'pwNation_error', {
      emptyMsg: '請填寫國籍'
    });
    hasError |= !validateTextField('ex_date', 'ex_date_error', {
      regex: /^\d{4}-\d{2}-\d{2}$/, emptyMsg: '請填寫護照效期', invalidMsg: '日期格式錯誤'
    });

    if (hasError) return;


    // 傳送資料
 const passengers = [];
 console.log("🚀 passengers to be sent:", passengers); // ✅ 新增這行

// ✅ 1. 收集會員本人資料（第一位旅客）
passengers.push({
  first_name: document.getElementById('firstName').value.trim(),
  last_name: document.getElementById('lastName').value.trim(),
  birthday: document.getElementById('birthday').value,
  nationality: document.getElementById('pwNation').value,
  passport_number: document.getElementById('pwNumber').value,
  passport_expiry: document.getElementById('ex_date').value,
  gender: genderInput.value
});

// ✅ 2. 收集第 2~N 位旅客（由 JS 動態產生）
document.addEventListener('DOMContentLoaded', () => {
  console.log('[debug] booking.js loaded – start get_passenger');

  fetch('/flight-2/api/booking/get_passenger.php')   // ← 確定路徑正確
    .then(r => {
      console.log('[debug] response status', r.status);
      return r.json();
    })
    .then(res => {
      console.log('[debug] get_passenger result', res);

      if (!res.success) {
        console.warn('API 回傳失敗：', res.error);
        return;
      }

      const totalPassengers = parseInt(res.count, 10) || 1;
      console.log('[debug] passenger count', totalPassengers);

      const extra = totalPassengers - 1;
      if (extra <= 0) return;                // 只有一人

      const tpl = document.getElementById('passenger-template').innerHTML;
      const container = document.getElementById('extraPassengers');

      for (let i = 2; i <= totalPassengers; i++) {
        container.insertAdjacentHTML('beforeend', tpl.replace(/{{i}}/g, i));
      }
      console.log('[debug] 已插入額外旅客', extra, '位');
    })
    .catch(err => console.error('[debug] fetch error', err));
});



console.log("開始送出 fetch");
    fetch('/flight-2/api/booking/save_passenger.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengers })
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          console.log('✅ 儲存成功，送出表單');
          // window.location.href = 'booking.html';  // ✅ 成功才跳轉
        } else {
          alert('❌ 儲存失敗：' + result.error);
        }
      })
      .catch(err => {
        alert('❌ 通訊錯誤：' + err);
        console.error(err);
      });
  });
});
// 跳轉至加價購畫面
document.getElementById('next_btn').addEventListener('click', function () {
    window.location.href = 'booking.html';
  });