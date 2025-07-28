// ✅ 通用欄位驗證函式
// const passengerCount = Number(localStorage.getItem('passenger_count') || 4);
// renderExtraPassengers(passengerCount);

fetch('/flight-2/api/booking/get_passenger.php')
  .then(res => res.json())
  .then(data => {
    if (data.success && data.count) {
      renderExtraPassengers(data.count);
    } else {
      renderExtraPassengers(1); // 預設只顯示會員
    }
  });

  // 購物車圖示顯示選擇資訊切換
// let cartToggleBound = false;

// function setupCartToggle() {
//     if (cartToggleBound) return;
//     cartToggleBound = true;

//     const cartIcon = document.getElementById('cartIcon');
//     const infoBox = document.querySelector('.SelectedFlightsInfo');

//     cartIcon.addEventListener('click', () => {
//         const isVisible = infoBox.style.display === 'block';
//         if (!selectedOutbound && !selectedReturn) {
//             alert('您尚未選擇航班！');
//             return;
//         }
//         infoBox.style.display = isVisible ? 'none' : 'block';
//         updateSelectedFlightInfo();
//     });
// }

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
    const passengers = [];
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

      // 收集會員資料
  passengers.push({
    first_name: document.getElementById('firstName').value.trim(),
    last_name: document.getElementById('lastName').value.trim(),
    birthday: document.getElementById('birthday').value,
    nationality: document.getElementById('pwNation').value,
    passport_number: document.getElementById('pwNumber').value,
    passport_expiry: document.getElementById('ex_date').value,
    gender: genderInput.value
  });

    // 🔽 放在送出按鈕 click 裡面、會員驗證之後
document.querySelectorAll('.passenger-form').forEach(form => {
  const get = field => form.querySelector(`[data-field="${field}"]`);
  const showError = (field, msg) => {
    const error = form.querySelector(`[data-error="${field}"]`);
    if (error) {
      error.textContent = msg;
      error.style.display = 'block';
    }
  };
  const hideError = field => {
    const error = form.querySelector(`[data-error="${field}"]`);
    if (error) error.style.display = 'none';
  };

  const val = {};
  ['first_name', 'last_name', 'birthday', 'gender', 'passport_number', 'nationality', 'passport_expiry']
    .forEach(f => val[f] = get(f)?.value.trim());

  // 驗證規則
  if (!val.last_name || !/^[a-zA-Z]+$/.test(val.last_name)) {
    showError('last_name', '請填寫正確英文姓');
    hasError = true;
  } else hideError('last_name');

  if (!val.first_name || !/^[a-zA-Z\-]+$/.test(val.first_name)) {
    showError('first_name', '請填寫正確英文名');
    hasError = true;
  } else hideError('first_name');

  if (!val.birthday || !/^\d{4}-\d{2}-\d{2}$/.test(val.birthday)) {
    showError('birthday', '請填寫正確生日格式');
    hasError = true;
  } else {
    const today = new Date();
    const bday = new Date(val.birthday);
    if (bday > today) {
      showError('birthday', '生日不能是未來時間');
      hasError = true;
    } else {
      hideError('birthday');
    }
  }

  if (!val.gender) {
    showError('gender', '請填寫性別');
    hasError = true;
  } else hideError('gender');

  if (!val.passport_number || !/^[0-9]{9}$/.test(val.passport_number)) {
    showError('passport_number', '護照格式錯誤：請填 9 位數字');
    hasError = true;
  } else hideError('passport_number');

  if (!val.nationality) {
    showError('nationality', '請填寫國籍');
    hasError = true;
  } else hideError('nationality');

  if (!val.passport_expiry || !/^\d{4}-\d{2}-\d{2}$/.test(val.passport_expiry)) {
    showError('passport_expiry', '請填寫護照有效期限');
    hasError = true;
  } else hideError('passport_expiry');

  // ✅ 收集資料 push 進 passengers 陣列（如果沒有錯）
  if (!hasError) {
    passengers.push(val);
  }
});
 // ✅ 若旅客有錯，停止送出
  if (hasError) return;


    // 傳送資料

 console.log("🚀 passengers to be sent:", passengers); // ✅ 新增這行

// ✅ 1. 收集會員本人資料（第一位旅客）
// passengers.push({
//   first_name: document.getElementById('firstName').value.trim(),
//   last_name: document.getElementById('lastName').value.trim(),
//   birthday: document.getElementById('birthday').value,
//   nationality: document.getElementById('pwNation').value,
//   passport_number: document.getElementById('pwNumber').value,
//   passport_expiry: document.getElementById('ex_date').value,
//   gender: genderInput.value
// });




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
          window.location.href = 'booking.html';  // ✅ 成功才跳轉
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
