// ✅ 最終整合版 JavaScript：性別選擇 + 欄位驗證 + 資料提交

// ✅ 通用欄位驗證函式（移到最上方）
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

// ✅ DOM 完全載入後執行主邏輯

document.addEventListener('DOMContentLoaded', function () {

  const genderDropdown = document.getElementById('genderDropdown');
  const genderInput = document.getElementById('genderInput');
const genderMenu = document.querySelector('#genderDropdown + .dropdown-menu');
const genderError = document.getElementById('gender_error');

  const next_btn = document.getElementById('next_btn');
console.log('genderDropdown', document.getElementById('genderDropdown'));
console.log('genderInput', document.getElementById('genderInput'));
console.log('genderError', document.getElementById('gender_error'));
console.log('next_btn', document.getElementById('next_btn'));

  // ✅ 性別選取功能
  genderMenu.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const gender = this.getAttribute('data-type');
      genderDropdown.textContent = gender;
      genderInput.value = gender;
      genderError.style.display = 'none';
      genderDropdown.classList.remove('border-error');
    });
  });

  // ✅ 點擊下一步按鈕：驗證 + 傳送資料
  next_btn.addEventListener('click', function (event) {
    event.preventDefault();
    let hasError = false;
    // const genderError = document.getElementById('gender_error');
    // ✅ 性別驗證
    if (genderInput.value === '') {
    //   genderError.style.display = 'block';
      genderDropdown.classList.add('border-error');
      hasError = true;
    } else {
      genderError.style.display = 'none';
      genderDropdown.classList.remove('border-error');
    }

    // ✅ 其他欄位驗證
    hasError |= !validateTextField('lastName', 'lastName_error', {
      regex: /^[a-zA-Z]+$/, emptyMsg: '請填寫英文姓', invalidMsg: '不得填寫數字或特殊符號！'
    });
    hasError |= !validateTextField('firstName', 'firstName_error', {
      regex: /^[a-zA-Z]+$/, emptyMsg: '請填寫英文名', invalidMsg: '不得填寫數字或特殊符號！'
    });
    hasError |= !validateTextField('passport_number', 'passport_number_error', {
      regex: /^[A-Z][0-9]{9}$/, emptyMsg: '請填寫身分證', invalidMsg: '格式錯誤，需 1 字母 + 9 數字'
    });
    hasError |= !validateTextField('birthday', 'birthday_error', {
      regex: /^\d{4}-\d{2}-\d{2}$/, emptyMsg: '請填寫出生日期', invalidMsg: '日期格式錯誤', maxDate: 'today', futureMsg: '出生日期不能是未來時間'
    });
    hasError |= !validateTextField('nationality', 'nationality_error', {
      regex: /^[a-zA-Z]+$/, emptyMsg: '請填寫國籍'
    });
    hasError |= !validateTextField('pwNumber', 'pwNumber_error', {
      regex: /^[A-Z][0-9]{9}$/, emptyMsg: '請填寫護照號碼', invalidMsg: '護照格式錯誤 G123456789'
    });
    hasError |= !validateTextField('pwNation', 'pwNation_error', {
      emptyMsg: '請填寫國籍'
    });
    hasError |= !validateTextField('pwIssuing_country', 'pwIssuing_country_error', {
      emptyMsg: '請選擇護照發行國'
    });
    hasError |= !validateTextField('ex_date', 'ex_date_error', {
      regex: /^\d{4}-\d{2}-\d{2}$/, emptyMsg: '請填寫護照效期', invalidMsg: '日期格式錯誤'
    });

    // ✅ 若驗證失敗停止提交
    if (hasError) return;

    // ✅ 組裝資料
    const payload = {
      first_name: document.getElementById('firstName').value.trim(),
      last_name: document.getElementById('lastName').value.trim(),
      birthday: document.getElementById('birthday').value,
      nationality: document.getElementById('nationality').value,
      passport_number: document.getElementById('pwNumber').value,
      passport_expiry: document.getElementById('ex_date').value,
      gender: genderInput.value
    };

    // ✅ 傳送資料
    fetch('/flight-2/api/booking/save_passenger.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          console.log('✅ 儲存成功，送出表單');
          document.getElementById('bookingForm').submit();
        } else {
          alert('❌ 儲存失敗：' + result.error);
        }
      })
      .catch(err => {
        alert('❌ 通訊錯誤：' + err);
        console.error(err);
      });
  });

  // ✅ 自動載入會員資料填入表單
  fetch('/flight-2/api/booking/get_passenger.php')
    .then(res => res.json())
    .then(data => {
      if (data.error) return alert(data.error);

      document.getElementById('firstName').value = data.first_name || '';
      document.getElementById('lastName').value = data.last_name || '';
      document.getElementById('birthday').value = data.birthday || '';
      document.getElementById('nationality').value = data.nationality || '';
      document.getElementById('pwNumber').value = data.passport_number || '';
      document.getElementById('ex_date').value = data.passport_expiry || '';
      genderInput.value = data.gender || '';
      genderDropdown.textContent = data.gender || '請選擇性別';
    });
});
// 監聽checkbox勾選狀態變化
        document.getElementById('flexCheckDefault').addEventListener('change', function() {
            console.log('勾選框狀態變更', this.checked);  // 打印勾選框狀態
            let dropdown = document.getElementById('friendDropdown');
            
            // 如果勾選了"同旅伴好友資料"，顯示好友選擇dropdown
            if (this.checked) {
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        });





