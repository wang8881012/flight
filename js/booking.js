document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. 取得共用 DOM ---------- */
  const seatModalEl   = document.getElementById('seatConfirmModal');
  const seatModal     = new bootstrap.Modal(seatModalEl);   // 只 new 一次
  const seatInfoSpan  = seatModalEl.querySelector('#seatInfo span');

  const seatInputHidden  = document.getElementById('seatInput');
  const outwardSeatLabel = document.getElementById('outward_seat');

  const confirmSeatBtn = document.getElementById('confirmSeatBtn');
  const nextBtn        = document.getElementById('Next_btn');

  const seatErr  = document.getElementById('seat_error');
  const mealErr  = document.getElementById('meal_error');
const rows = [
    { count: 4, y: 100, class: 'bs', size: 30, row: 1, aisleGap: 0 },
    { count: 4, y: 140, class: 'bs', size: 30, row: 2, aisleGap: 0 },
    { count: 4, y: 180, class: 'bs', size: 30, row: 3, aisleGap: 0 },
    { count: 6, y: 230, class: 'lux', size: 20, row: 1, aisleGap: 12 },
    { count: 6, y: 270, class: 'lux', size: 20, row: 2, aisleGap: 12 },
    { count: 6, y: 310, class: 'lux', size: 20, row: 3, aisleGap: 12 },
    { count: 6, y: 360, class: 'pro', size: 18, row: 4, aisleGap: 10 },
    { count: 6, y: 400, class: 'pro', size: 18, row: 5, aisleGap: 10 },
    { count: 6, y: 440, class: 'pro', size: 18, row: 6, aisleGap: 10 },
    { count: 6, y: 490, class: 'st', size: 17, row: 7, aisleGap: 8 },
    { count: 6, y: 530, class: 'st', size: 17, row: 8, aisleGap: 8 },
    { count: 6, y: 570, class: 'st', size: 17, row: 9, aisleGap: 8 },
    { count: 6, y: 610, class: 'st', size: 17, row: 10, aisleGap: 8 }
];



const seatSize = 20;
const aisleGap = 10;
const seatGap = 5; //座位間距

let selectedSeat = null; //選擇座位 一開始預設null
let hoveredSeat = null; // 當滑鼠移動到座位上時，顯示座位資訊

// 選擇座位modalbox
// const seatModal = new bootstrap.Modal(document.getElementById('seatConfirmModal'));
const seatInfo = document.querySelector('#seatInfo span');

const canvas = document.getElementById('seatCanvas');
const img = new Image();
img.src = '/flight-2/assets/images/flight_seat.svg';
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    drawMap();
};


function drawMap() { /*畫背景+座位*/
    const ctx = canvas.getContext('2d'); //用2d圖渲染
    ctx.clearRect(0, 0, canvas.width, canvas.height);  //使用 ctx 对象进行绘图，清除畫布 從(x, y)=(0,0)定位
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //畫背景圖

    rows.forEach(rowInfo => {
        const { count, y, class: cls, size, aisleGap, row } = rowInfo; //每排幾位,y,艙等,座位大小,走道空間,此為第幾排
        const totalSeatWidth = count * size + (count - 1) * seatGap + aisleGap;
        let x0 = (canvas.width - totalSeatWidth) / 2; // 座位起點 X

        for (let i = 0; i < count; i++) {
            if (i === 3 && count === 6) x0 += aisleGap; // 6位一排，如果是中間走道，增加空隙

            ctx.fillStyle = {
                bs: '#999',
                lux: '#aaa',
                pro: '#bbb',
                st: '#ccc'
            }[cls]; // 依照艙等選顏色


            ctx.fillRect(x0, y, size, size); // 畫座位本體
            ctx.strokeRect(x0, y, size, size); // 加邊框
            // 座位代碼繪製（文字）
            ctx.fillStyle = '#000';
            ctx.font = `${size * 0.4}px sans-serif`;
            if (cls === 'bs') {
                // 商務艙：J1 ~ J12
                const index = rows
                    .filter(r => r.class === 'bs')
                    .slice(0, rows.indexOf(rowInfo))
                    .reduce((sum, r) => sum + r.count, 0) + i + 1;
                ctx.fillText(`J${index}`, x0 + size / 4, y + size / 1.5);
            } else {
                // 其他艙等照正常 A~F+row
                ctx.fillText(`${String.fromCharCode(65 + i)}${row}`, x0 + size / 4, y + size / 1.5);
            }
            x0 += size + seatGap;
        }
    });
    // 畫 hover 提示
    if (hoveredSeat) {
        ctx.fillStyle = '#000';
        ctx.font = '14px sans-serif';
        ctx.fillText(`座位：${hoveredSeat}`, 10, canvas.height - 10);
    }
}

const popoverEl = document.getElementById('seatPopover');
const popover = new bootstrap.Popover(popoverEl);
let activePopover = false;
// 座位點擊互動示例
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    hoveredSeat = null;
    let found = false;

    rows.forEach(rowInfo => {
        const { count, y, size, aisleGap, row,class:cls } = rowInfo;
        const totalSeatWidth = count * seatSize + (count - 1) * seatGap;
        let x0 = (canvas.width - totalSeatWidth) / 2;
        let seatLabel;
        for (let i = 0; i < count; i++) {
             // 特別處理 J 座位（只對 count == 4）
            if (i === 3 && count === 4) {
                const jX = x0 + size + seatGap;  // 計算 J 座位的位置（在第 4 個座位右邊）
                if (mx >= jX && mx <= jX + size && my >= y && my <= y + size) {
                     hoveredSeat = `J${row}`;
                       
                // 顯示 popover
        const clientX = e.clientX;
        const clientY = e.clientY;

        popoverEl.style.left = `${clientX + 10}px`;
        popoverEl.style.top = `${clientY - 10}px`;
        popoverEl.setAttribute('data-bs-content', `座位：${hoveredSeat}`);
        popoverEl.classList.remove('d-none');

         // 重建 popover
        bootstrap.Popover.getInstance(popoverEl)?.dispose(); // 移除舊的
        new bootstrap.Popover(popoverEl, {
          content: `座位：${seatLabel}`,
          trigger: 'manual',
          placement: 'top',
        }).show();

        activePopover = true;
        found = true;
        return;
      }

      x0 += size + seatGap;
    }
    // 處理一般座位 hover
    if (mx >= x0 && mx <= x0 + size && my >= y && my <= y + size) {
      hoveredSeat = cls === 'bs'
        ? `J${rows.filter(r => r.class === 'bs').slice(0, rows.indexOf(rowInfo)).reduce((s, r) => s + r.count, 0) + i + 1}`
        : `${String.fromCharCode(65 + i)}${row}`;

      const clientX = e.clientX;
      const clientY = e.clientY;

      popoverEl.style.left = `${clientX + 10}px`;
      popoverEl.style.top = `${clientY - 10}px`;
      popoverEl.setAttribute('data-bs-content', `座位：${hoveredSeat}`);
      popoverEl.classList.remove('d-none');

      if (!activePopover) {
        popover.show();
        activePopover = true;
      } else {
        popover.setContent && popover.setContent({ '.popover-body': `座位：${hoveredSeat}` });
      }

      found = true;
      drawMap();
      return;
    }

    x0 += size + seatGap;
  }
});

   if (!found && activePopover) {
    bootstrap.Popover.getInstance(popoverEl)?.hide();
    activePopover = false;
    popoverEl.classList.add('d-none');
  }
});


    // 點空白處
//     if (!hoveredSeat) drawMap();
// });

// 點擊座位 → 彈出 modal
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const my = (e.clientY - rect.top) * (canvas.height / rect.height);

  let clicked = false;

  rows.forEach(rowInfo => {
    const { count, y, class: cls, size, aisleGap, row } = rowInfo;
    let x0 = (canvas.width - (count * size + (count - 1) * seatGap + aisleGap)) / 2;

    for (let i = 0; i < count; i++) {
      if (i === 3 && count === 6) x0 += aisleGap;

      if (mx >= x0 && mx <= x0 + size && my >= y && my <= y + size) {
        selectedSeat = cls === 'bs'
          ? `J${rows.filter(r => r.class === 'bs').slice(0, rows.indexOf(rowInfo)).reduce((s, r) => s + r.count, 0) + i + 1}`
          : `${String.fromCharCode(65 + i)}${row}`;

        seatInfo.textContent = selectedSeat;
        seatModal.show();
        clicked = true;
        return;
      }
      
      x0 += size + seatGap;
    }
  });

   /* ---------- 2. 當 Modal 關閉時，把焦點固定移到 Next ---------- */
  seatModalEl.addEventListener('hidden.bs.modal', () => {
    nextBtn.focus();
  });
});



/* ---------- 2. 點「確認座位」：關閉 Modal，寫入隱藏欄位 ---------- */
 confirmSeatBtn.addEventListener('click', () => {
    if (!selectedSeat) return;                 // 理論上不會發生
    seatInputHidden.value = selectedSeat;      // 寫入隱藏欄位
    outwardSeatLabel.textContent = selectedSeat;
    seatModal.hide();                          // hidden.bs.modal → 焦點自動到 Next
  });

  /* ---------- 4. 「Next」按鈕：驗證 → 若 modal 開啟就關 → 跳頁 ---------- */
  nextBtn.addEventListener('click', () => {

    /* === 4‑1. 驗證 === */
    let ok = true;

    if (!selectedSeat) { seatErr.style.display = 'block'; ok = false; }
    else               { seatErr.style.display = 'none';  }

    const pickedMeal = document.querySelector('.meal-btn.selected');
    if (!pickedMeal)  { mealErr.style.display = 'block';  ok = false; }
    else              { mealErr.style.display = 'none';   }

    if (!ok) return;

    /* === 4‑2. 若還在 modal，先關掉 === */
    bootstrap.Modal.getInstance(seatModalEl)?.hide();

    /* === 4‑3. 延遲 400 ms (淡出動畫) 後跳轉 === */
    setTimeout(() => {
      window.location.href = 'booking00.html';   // ← 依實際路徑調整
    }, 400);
  });

  /* ---------- 5. 其餘：行李下拉、餐點單選、fetch 航班資料 ---------- */
  /* ……這些區塊與跳轉無關，保留原實作即可…… */

});



const checked_wt_btn = document.getElementById('checked_wt_btn');
const weightItems = document.querySelectorAll('.dropdown-item');

weightItems.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault(); //不要跳頁
        const selectedType = item.dataset.type;  // "carryon" 或 "checked"
        const selectedWeight = item.dataset.weight;
        if  (selectedType == 'checked') {
            checked_wt_btn.textContent = selectedWeight;
            document.getElementById('checked_baggageWeight').value = selectedWeight;
            console.log('托運行李重量:', selectedWeight);
            outward_checked.textContent = selectedWeight; // 更新顯示的托運行李重量
        }

    });
});


// 選餐按鈕單選
document.addEventListener('DOMContentLoaded', function () {
const mealButtons = document.querySelectorAll('.meal-btn');
const mealInput = document.getElementById('mealInput');
const outward_meal = document.getElementById('outward_meal');
mealButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        mealButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        mealInput.value = btn.dataset.value;
        outward_meal.textContent = btn.dataset.value; // 更新顯示的餐點
        console.log(`已選擇：${btn.dataset.value}`); // 測試點擊是否成功
    });
});
  });


fetch('/flight-2/api/booking/get_meals.php')
  .then(r => r.json())
  .then(res => {
     res.data.forEach(meal => {
      const btn = document.querySelector(`.meal-btn[data-id="${meal.id}"]`);
      if (!btn) return;                           // 只有在 HTML 找得到才更新
      const badge = btn.querySelector('.price-badge');
      badge.textContent = `${meal.price}元`;
      badge.classList.remove('d-none');
      btn.dataset.price = meal.price;     // 儲存價格到 data-price
      
      });
  });



fetch('/flight-2/api/booking/get_flight_data.php')
  .then(res => res.json())
  .then(data => {
     if (data.outbound) {
      document.getElementById('outward_place_from').textContent = data.outbound.from_airport;
      document.getElementById('outward_place_to').textContent = data.outbound.to_airport;
      document.getElementById('outward_time_from').textContent = data.outbound.departure_time;
    }
    if (data.inbound) {
      document.getElementById('return_place_from').textContent = data.inbound.from_airport;
      document.getElementById('return_place_to').textContent = data.inbound.to_airport;
      document.getElementById('return_time_to').textContent = data.inbound.arrival_time;
    }
  });
    // .catch(err => console.error("無法載入航班資料", err));

fetch('/flight-2/api/booking/get_baggage.php')
  .then(r => r.json())
  .then(res => {
    const ul = document.querySelector('#checked_wt_btn + .dropdown-menu');
    res.data.forEach(bag => {
       const btn = document.querySelector(
        `.dropdown-item[data-weight="${bag.name}"]`
      );
      if (!btn) return;                  // 只有找到對應重量才更新
      btn.dataset.price = bag.price;     // 價格存進 dataset
      btn.textContent   = `${bag.name}（${bag.price}元）`;
    });
  });


