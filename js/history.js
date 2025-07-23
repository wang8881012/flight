// 篩選資料設定
const historySearch = document.getElementById("historySearch");
const historySearchBtn = document.getElementById("historySearchBtn");
const historyCleanBtn = document.getElementById("historyCleanBtn");

historySearchBtn.addEventListener("click", filterOrder);
historySearch.addEventListener("keyup", e => {
    if (e.key === "Enter") filterOrder();
})

function filterOrder() {
    const keyword = historySearch.value.trim();
    const rows = document.querySelectorAll("#historyTable tbody tr:not(#noDataRow)");
    let hasVisibleRow = false;

    // 如果沒輸入關鍵字，直接全部顯示
    if (!keyword) {
        rows.forEach(row => {
            row.style.display = "";
        });
        document.getElementById("noDataRow").style.display = "none";
        return;
    }

    // 有輸入關鍵字才篩選
    rows.forEach(row => {
        const orderId = row.querySelector("th").textContent.trim().toLowerCase();
        const match = orderId.includes(keyword);
        row.style.display = match ? "" : "none";
        if (match) hasVisibleRow = true;
    });

    // 沒有符合條件顯示「無資料」
    document.getElementById("noDataRow").style.display = hasVisibleRow ? "none" : "";
}
//清除
historyCleanBtn.addEventListener("click", () => {
    historySearch.value = "";
    filterOrder(); // 重新執行 filterOrder 來顯示全部資料
});


// api
document.addEventListener("DOMContentLoaded", function () {
    fetch("../api/auth/history.php")
        .then(res => {
            if (!res.ok) {
                throw new Error("伺服器錯誤，請稍後再試");
            }
            return res.json();
        })
        .then(data => {
            if (data.success === false) {
                console.error("錯誤：", data.error);
                alert("取得歷史訂單失敗：" + data.error);
            } else {
                //console.log("歷史訂單：", data);

                // 顯示在畫面上
                const tbody = document.getElementById("historyTableBody");

                // 英文轉中文
                const statusMap = {
                    success: "已付款",
                };

                const classMap = {
                    business: "商務艙",
                    economy: "經濟艙",
                }

                const addonMap = {
                    "meat-based": "葷食餐",
                    "vegetarian": "素食餐",
                    "Extra Baggage 10kg": "額外行李10kg",
                    "Extra Baggage 15kg": "額外行李15kg",
                    "Extra Baggage 20kg": "額外行李20kg",
                }

                // 日期格式轉換
                function formatTime(datetimeStr) {
                    const d = new Date(datetimeStr);
                    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
                }

                data.data.forEach(order => {
                    const tr = document.createElement("tr");
                    tr.className = "text-center align-middle";

                    const statusText = statusMap[order.訂單狀態] || order.訂單狀態;
                    const classText = classMap[order.艙等] || order.艙等;
                    const addon = order.加購項目;
                    const addonText = addon
                        ? addon.split(",").map(item => addonMap[item.trim()] || item.trim()).join("、")
                        : "無加購";
                    const departTime = formatTime(order.出發時間);
                    const returnTime = formatTime(order.抵達時間);
                    const createdAt = formatTime(order.訂票時間);

                    tr.innerHTML = `
                        <th>${order.訂單編號}</th>
                        <td>
                            <p>${order.出發地機場代碼}</p>
                            <p>${order.出發地機場名稱}</p>
                        </td>
                        <td>
                            <p>${order.目的地機場代碼}</p>
                            <p>${order.目的地機場名稱}</p>
                        </td>
                        <td>
                            <p>${departTime}</p>
                            <p>〡</p>
                            <p>${returnTime}</p>
                        </td>
                        <td></td>
                        <td>${classText}</td>
                        <td>${statusText}</td>
                        <td>${createdAt}</td>
                        <td>${addonText}</td>
                        <td>${order.總計 ? `TWD ${Number(order.總計).toLocaleString("en-US")}` : "無資料"}</td>
                        `;

                    tbody.appendChild(tr);
                });
            }
        })
        .catch(error => {
            console.error("例外錯誤：", error);
            alert("發生錯誤：" + error.message);
        });
});
