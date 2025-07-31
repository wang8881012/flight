// addon_selection.js

document.addEventListener('DOMContentLoaded', () => {
    // 行李選單點選事件（去程與回程共用）
    document.querySelectorAll('.dropdown-item[data-type="checked"]').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault(); // 避免點擊 <a href="#"> 跳到頁面頂部

            const weight = this.dataset.weight;
            const price = this.dataset.price;

            if (this.closest('#outboundCollapse')) {
                // 去程選項
                document.getElementById('checked_wt_btn').innerText = weight;
                document.getElementById('checked_baggageWeight').value = weight;
                document.getElementById('checked_baggagePrice').value = price;
            }

            if (this.closest('#returnCollapse')) {
                // 回程選項
                document.getElementById('return_checked_wt_btn').innerText = weight;
                document.getElementById('return_checked_baggageWeight').value = weight;
                document.getElementById('return_checked_baggagePrice').value = price;
            }
        });
    });

    // ✨ 去程餐點選擇
    document.querySelectorAll('.meal-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.getElementById('mealInput').value = this.dataset.value;

            // 先移除所有 active 樣式，再套用目前這個
            document.querySelectorAll('.meal-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ✨ 回程餐點選擇
    document.querySelectorAll('.return-meal-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.getElementById('return_mealInput').value = this.dataset.value;

            document.querySelectorAll('.return-meal-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
